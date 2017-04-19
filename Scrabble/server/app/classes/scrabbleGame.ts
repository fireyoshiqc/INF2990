/**
 * scrabbleGame.ts - implements a scrabble game
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/03/15
 */

import { BoardTile, TileType } from './boardTile';
import { CommandPlaceWord } from './commandPlaceWord';
import { Letter } from './letter';
import * as data from '../../assets/objects/scrabbleBoard.json';
import { Dictionary } from '../modules/dictionary.module';
import { WordList, IWord } from './wordList';
import { Player } from '../classes/player';

export class ScrabbleGame {
    private board: BoardTile[][];
    private readonly BOARD_SIZE = 15;
    private wordList: WordList;
    private usedTilesPerTurn: BoardTile[];

    constructor() {
        this.board = [];
        this.loadBoard();
        this.wordList = new WordList();
        this.usedTilesPerTurn = [];
    }

    public getBoard(): BoardTile[][] {
        return this.board;
    }

    public getWordList(): WordList {
        return this.wordList;
    }

    private loadBoard(): void {
        let scrabbleBoardArray = (<any>data).array;

        for (let i = 0; i < this.BOARD_SIZE; i++) {
            this.board[i] = [];

            for (let j = 0; j < this.BOARD_SIZE; j++) {
                this.board[i][j] = new BoardTile(<TileType>scrabbleBoardArray[i][j]);
            }
        }
    }

    private getTile(command: CommandPlaceWord, offset: number): BoardTile {
        // If the specified command orientation is horizontal, get the offset column.
        // Otherwise, get the offset row.
        const row = command.getRow();
        const column = command.getColumn();
        return command.getOrientation() === "h"
            ? this.board[row][column + offset]
            : this.board[row + offset][column];
    }

    public findLettersToRemove(command: CommandPlaceWord): string[] {
        let word = command.getWord();
        let tile: BoardTile;
        let lettersToRemove = new Array<string>();

        for (let i = 0; i < word.length; i++) {
            tile = this.getTile(command, i);

            // JOKER
            if (tile.isEmpty()) {
                // If the letter is not the same when put to uppercase, that means it's a joker character.
                (word[i] === word[i].toUpperCase()) ?
                    lettersToRemove.push("JOKER") : // JOKER
                    lettersToRemove.push(word[i]);  // REGULAR LETTERS
            }
        }

        return lettersToRemove;
    }

    public placeWord(command: CommandPlaceWord): void {
        let word = command.getWord();
        let tile;

        for (let i = 0; i < word.length; i++) {
            tile = this.getTile(command, i);

            if (tile.isEmpty()) {
                // JOKER
                (word[i] === word[i].toUpperCase()) ?
                    // JOKER used as LETTER is worth 0 point
                    tile.putLetter(new Letter(word[i], true)) :
                    tile.putLetter(new Letter(word[i]));
                tile.setCanRemoveLetter(true); // Is undoable if newly formed words are invalid
            } else {
                tile.setCanRemoveLetter(false);
            }
        }
    }

    // Called when newly formed words are invalid
    public removeWord(command: CommandPlaceWord, player: Player): string {
        let word = command.getWord();
        let tile;
        let wordToUpdate = "";
        let lettersToPutBack = new Array<Letter>();

        for (let i = 0; i < word.length; i++) {
            tile = this.getTile(command, i);

            if (tile.getCanRemoveLetter()) {
                // Letters to be removed need to be removed from the server's board
                tile.removeLetter();

                // Letters to be removed need to be removed from the client's board
                wordToUpdate += "-";

                // Letters to be removed need to be placed back on the player's rack
                (word[i] === word[i].toUpperCase()) ?
                    lettersToPutBack.push(new Letter("JOKER")) :
                    lettersToPutBack.push(new Letter(word[i]));
            } else {
                wordToUpdate += word[i];
            }
        }

        player.addLetters(lettersToPutBack);
        return wordToUpdate;
    }

    public countAllNewWordsPoint(): number {
        let score = 0;

        this.wordList.getNewWords().forEach(word => {
            score += this.countWordPoint(word);
        });

        this.wordList.updateExistingWords();
        return score;
    }

    private countWordPoint(playedWord: IWord): number {
        let score = 0;
        let tile;
        let doubleWord = false, tripleWord = false;

        for (let i = 0; i < playedWord.word.length; i++) {
            tile = playedWord.orientation === "h"
                ? this.board[playedWord.row][playedWord.column + i]
                : this.board[playedWord.row + i][playedWord.column];

            if (tile.getTileType() === "DoubleWord" || tile.getTileType() === "Center") {
                doubleWord = true;
            } else if (tile.getTileType() === "TripleWord") {
                tripleWord = true;
            }

            score += tile.countTilePoint();

            // Add tile to usedTiles
            this.usedTilesPerTurn.push(tile);
        }

        // DoubleWord / TripleWord bonuses
        if (doubleWord) {
            score *= 2;
        }

        if (tripleWord) {
            score *= 3;
        }

        return score;
    }

    public deactivateUsedTilesBonus(): void {
        this.usedTilesPerTurn.forEach(tile => {
            tile.deactivateBonus();
        });

        this.usedTilesPerTurn = [];
    }

    public isWordValid(command: CommandPlaceWord, firstWord: boolean): boolean {
        return (firstWord
            ? this.isWordOverlappingCentralTile(command)
            : this.isWordAdjacentToAnother(command))
            && this.isWordInBounds(command) && this.isWordCorrectlyOverlapping(command);
    }

    public isWordInBounds(command: CommandPlaceWord): boolean {
        return (((command.getOrientation() === "h") ?
            command.getColumn() : command.getRow()) + command.getWord().length) <= this.BOARD_SIZE;
    }

    public isWordCorrectlyOverlapping(command: CommandPlaceWord): boolean {
        let tile;
        let rowIndex;
        let columnIndex;

        for (let i = 0; i < command.getWord().length; i++) {
            rowIndex = (command.getOrientation() === "h") ? command.getRow() : (command.getRow() + i);
            columnIndex = (command.getOrientation() === "h") ? (command.getColumn() + i) : command.getColumn();
            tile = this.board[rowIndex][columnIndex];

            if (!tile.isEmpty() && tile.getLetter().getCharacter() !== command.getWord().charAt(i).toUpperCase()) {
                return false;
            }
        }

        return true;
    }

    public isNewWord(command: CommandPlaceWord): boolean {
        let tile;
        let rowIndex;
        let columnIndex;

        for (let i = 0; i < command.getWord().length; i++) {
            rowIndex = (command.getOrientation() === "h") ? command.getRow() : (command.getRow() + i);
            columnIndex = (command.getOrientation() === "h") ? (command.getColumn() + i) : command.getColumn();
            tile = this.board[rowIndex][columnIndex];

            if (tile.isEmpty()) {
                return true;
            }
        }

        return false;
    }

    public isWordOverlappingCentralTile(command: CommandPlaceWord): boolean {
        let centralIndex = 7;
        let rowIndex;
        let columnIndex;

        for (let i = 0; i < command.getWord().length; i++) {
            rowIndex = (command.getOrientation() === "h") ? command.getRow() : (command.getRow() + i);
            columnIndex = (command.getOrientation() === "h") ? (command.getColumn() + i) : command.getColumn();

            if (rowIndex === centralIndex && columnIndex === centralIndex) {
                return true;
            }
        }

        return false;
    }

    public isWordAdjacentToAnother(command: CommandPlaceWord): boolean {
        let tile;
        let rowIndex;
        let columnIndex;

        for (let i = 0; i < command.getWord().length; i++) {
            rowIndex = (command.getOrientation() === "h") ? command.getRow() : (command.getRow() + i);
            columnIndex = (command.getOrientation() === "h") ? (command.getColumn() + i) : command.getColumn();
            tile = this.board[rowIndex][columnIndex];

            if (tile.isEmpty() && this.isLetterAdjacentTo(rowIndex, columnIndex)) {
                return true;
            }
        }

        return false;
    }

    private isLetterAdjacentTo(rowIndex: number, columnIndex: number): boolean {
        // Check upper tile
        return this.isTileAdjacent(rowIndex - 1, columnIndex) // Left tile
            || this.isTileAdjacent(rowIndex, columnIndex - 1) // Up tile
            || this.isTileAdjacent(rowIndex + 1, columnIndex) // Right tile
            || this.isTileAdjacent(rowIndex, columnIndex + 1); // Down tile
    }

    private isTileAdjacent(rowIndex: number, columnIndex: number): boolean {
        return this.isTileInBounds(rowIndex, columnIndex) && !this.board[rowIndex][columnIndex].isEmpty();
    }

    private isTileInBounds(rowIndex: number, columnIndex: number): boolean {
        return rowIndex >= 0 && rowIndex < this.BOARD_SIZE &&
            columnIndex >= 0 && columnIndex < this.BOARD_SIZE;
    }

    public areAllWordsValid(): boolean {
        return this.areAllHorizontalWordsValid() && this.areAllVerticalWordsValid();
    }

    private areAllHorizontalWordsValid(): boolean {
        // Verify if every horizontal word is valid
        // Horizontal words start from column 0 to column 13 (words have a minimum of two letters)
        for (let i = 0; i < this.BOARD_SIZE; i++) {
            for (let j = 0; j < (this.BOARD_SIZE - 1); j++) {
                let tile = this.board[i][j];

                if (!tile.isEmpty()) {

                    // Verify if the letter is the start of a horizontally oriented word
                    if (((j === 0) || this.board[i][j - 1].isEmpty()) && !this.board[i][j + 1].isEmpty()) {
                        let thisWord = tile.getLetter().getCharacter();
                        let column = j;

                        // Retrieve the next tile (to form the word) if in bounds
                        while ((column + 1) < this.BOARD_SIZE) {
                            column++;
                            tile = this.board[i][column];

                            if (!tile.isEmpty()) {
                                thisWord += tile.getLetter().getCharacter();
                            } else {
                                break;
                            }
                        }

                        if (Dictionary.isWordValid(thisWord)) {
                            // Add the newly formed word
                            this.wordList.updateNewWords({ row: i, column: j, orientation: "h", word: thisWord });
                        } else {
                            this.wordList.clearNewWords();
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }

    private areAllVerticalWordsValid(): boolean {
        // Verify if every vertical word is valid
        // Vertical words start from row 0 to row 13 (words have a minimum of two letters)
        for (let i = 0; i < (this.BOARD_SIZE - 1); i++) {
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                let tile = this.board[i][j];

                if (!tile.isEmpty()) {

                    // Verify if the letter is the start of a vertically oriented word
                    if (((i === 0) || this.board[i - 1][j].isEmpty()) && !this.board[i + 1][j].isEmpty()) {
                        let thisWord = tile.getLetter().getCharacter();
                        let row = i;

                        // Retrieve the next tile (to form the word) if in bounds
                        while ((row + 1) < this.BOARD_SIZE) {
                            row++;
                            tile = this.board[row][j];

                            if (!tile.isEmpty()) {
                                thisWord += tile.getLetter().getCharacter();
                            } else {
                                break;
                            }
                        }

                        if (Dictionary.isWordValid(thisWord)) {
                            // Ajouter le mot valide au tableau
                            this.wordList.updateNewWords({ row: i, column: j, orientation: "v", word: thisWord });
                        } else {
                            this.wordList.clearNewWords();
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }
}
