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
    private readonly BOARD_LENGTH = 15;
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

    private loadBoard() {
        let scrabbleBoardArray = (<any>data).array;

        for (let i = 0; i < this.BOARD_LENGTH; i++) {
            this.board[i] = [];

            for (let j = 0; j < this.BOARD_LENGTH; j++) {
                this.board[i][j] = new BoardTile(<TileType>scrabbleBoardArray[i][j]);
            }
        }
    }

    private getTile(command: CommandPlaceWord, offset: number): BoardTile {
        if (command.getOrientation() === "h") {
            return this.board[command.getRow()][command.getColumn() + offset];
        } else {
            return this.board[command.getRow() + offset][command.getColumn()];
        }
    }

    public findLettersToRemove(command: CommandPlaceWord): string[] {
        let word = command.getWord();
        let tile: BoardTile;
        let lettersToRemove = new Array<string>();

        for (let i = 0; i < word.length; i++) {
            tile = this.getTile(command, i);

            if (tile.isEmpty()) {
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
                tile.activateCanRemoveLetter(); // Is undoable if newly formed words are invalid
            } else {
                tile.deactivateCanRemoveLetter();
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

    private countWordPoint(word: IWord): number {
        let score = 0;
        let tile;
        let doubleWord = false, tripleWord = false;

        for (let i = 0; i < word.word.length; i++) {
            if (word.orientation === "h") {
                tile = this.board[word.row][word.column + i];
            } else {
                tile = this.board[word.row + i][word.column];
            }

            if (tile.getTileType() === "DoubleWord" || tile.getTileType() === "Center") {
                doubleWord = true;
            } else if (tile.getTileType() === "TripleWord") {
                tripleWord = true;
            }

            score += tile.countTilePoint();

            // Add tile to usedTiles
            this.usedTilesPerTurn.push(tile);
        }

        // Traitement doubleWord / TripleWord
        if (doubleWord) {
            score *= 2;
        }

        if (tripleWord) {
            score *= 3;
        }

        return score;
    }

    public disactivateUsedTilesBonus(): void {
        this.usedTilesPerTurn.forEach(tile => {
            tile.disactivateBonus();
        });

        this.usedTilesPerTurn = [];
    }

    public isWordInBounds(command: CommandPlaceWord): boolean {
        return (((command.getOrientation() === "h") ?
            command.getColumn() : command.getRow()) + command.getWord().length) <= this.BOARD_LENGTH;
    }

    public isWordCorrectlyOverlapping(command: CommandPlaceWord): boolean {
        let tile;
        let rowIndex;
        let columnIndex;
        let isNewWord = false;

        for (let i = 0; i < command.getWord().length; i++) {
            rowIndex = (command.getOrientation() === "h") ? command.getRow() : (command.getRow() + i);
            columnIndex = (command.getOrientation() === "h") ? (command.getColumn() + i) : command.getColumn();
            tile = this.board[rowIndex][columnIndex];

            if (tile.isEmpty()) {
                isNewWord = true;
            } else if (tile.getLetter().getCharacter() !== command.getWord().charAt(i).toUpperCase()) {
                return false;
            }
        }

        return isNewWord;
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
        let upperRowIndex = rowIndex - 1;
        let upperColumnIndex = columnIndex;

        if (this.isTileInBounds(upperRowIndex, upperColumnIndex) &&
            !this.board[upperRowIndex][upperColumnIndex].isEmpty()) {
            return true;
        }

        // Check left tile
        let leftRowIndex = rowIndex;
        let leftColumnIndex = columnIndex - 1;

        if (this.isTileInBounds(leftRowIndex, leftColumnIndex) &&
            !this.board[leftRowIndex][leftColumnIndex].isEmpty()) {
            return true;
        }

        // Check lower tile
        let lowerRowIndex = rowIndex + 1;
        let lowerColumnIndex = columnIndex;

        if (this.isTileInBounds(lowerRowIndex, lowerColumnIndex) &&
            !this.board[lowerRowIndex][lowerColumnIndex].isEmpty()) {
            return true;
        }

        // Check right tile
        let rightRowIndex = rowIndex;
        let rightColumnIndex = columnIndex + 1;

        if (this.isTileInBounds(rightRowIndex, rightColumnIndex) &&
            !this.board[rightRowIndex][rightColumnIndex].isEmpty()) {
            return true;
        }

        return false;
    }

    private isTileInBounds(rowIndex: number, columnIndex: number): boolean {
        return rowIndex >= 0 && rowIndex < this.BOARD_LENGTH &&
            columnIndex >= 0 && columnIndex < this.BOARD_LENGTH;
    }

    public areAllHorizontalWordsValid(command: CommandPlaceWord): boolean {
        // Verify if every horizontal word is valid
        // Horizontal words start from column 0 to column 13 (words have a minimum of two letters)
        for (let i = 0; i < this.BOARD_LENGTH; i++) {
            for (let j = 0; j < (this.BOARD_LENGTH - 1); j++) {
                let tile = this.board[i][j];

                if (!tile.isEmpty()) {

                    // Verify if the letter is the start of a horizontally oriented word
                    if (((j === 0) || this.board[i][j - 1].isEmpty()) && !this.board[i][j + 1].isEmpty()) {
                        let thisWord = tile.getLetter().getCharacter();
                        let column = j;

                        // Retrieve the next tile (to form the word) if in bounds
                        while ((column + 1) < this.BOARD_LENGTH) {
                            column++;
                            tile = this.board[i][column];

                            if (!tile.isEmpty()) {
                                thisWord += tile.getLetter().getCharacter();
                            } else {
                                break;
                            }
                        }

                        if (Dictionary.isWordValid(thisWord)) {
                            // Ajouer le nouveau mot forme
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

    public areAllVerticalWordsValid(command: CommandPlaceWord): boolean {
        // Verify if every vertical word is valid
        // Vertical words start from row 0 to row 13 (words have a minimum of two letters)
        for (let i = 0; i < (this.BOARD_LENGTH - 1); i++) {
            for (let j = 0; j < this.BOARD_LENGTH; j++) {
                let tile = this.board[i][j];

                if (!tile.isEmpty()) {

                    // Verify if the letter is the start of a vertically oriented word
                    if (((i === 0) || this.board[i - 1][j].isEmpty()) && !this.board[i + 1][j].isEmpty()) {
                        let thisWord = tile.getLetter().getCharacter();
                        let row = i;

                        // Retrieve the next tile (to form the word) if in bounds
                        while ((row + 1) < this.BOARD_LENGTH) {
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

    public copyBoard(board: BoardTile[][]): BoardTile[][] {
        let copyBoard: BoardTile[][] = [];

        for (let i = 0; i < this.BOARD_LENGTH; i++) {
            copyBoard[i] = [];

            for (let j = 0; j < this.BOARD_LENGTH; j++) {
                copyBoard[i][j] = this.board[i][j].copyBoardTile();
            }
        }

        return copyBoard;
    }
}
