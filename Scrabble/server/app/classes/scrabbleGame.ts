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

export class ScrabbleGame {
    private board: BoardTile[][];
    private readonly BOARD_LENGTH = 15;

    // TODO : letterStash
    // private letterStash: Letter[];

    constructor() {
        this.board = [];
        this.loadBoard();
    }

    getBoard(): BoardTile[][] {
        return this.board;
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

    placeWord(command: CommandPlaceWord): void {
        let word = command.getWord();

        for (let i = 0; i < word.length; i++) {
            if (command.getOrientation() === "h") {
                this.board[command.getRow()][command.getColumn() + i].putLetter(new Letter(word[i]));
            } else {
                this.board[command.getRow() + i][command.getColumn()].putLetter(new Letter(word[i]));
            }
        }
    }

    // the word point is counted before the word is placed
    countWordPoint(command: CommandPlaceWord): number {
        let score = 0;
        let tile;
        let doubleWord = false, tripleWord = false;

        for (let i = 0; i < command.getWord().length; i++) {
            if (command.getOrientation() === "h") {
                tile = this.board[command.getRow()][command.getColumn() + i];
            } else {
                tile = this.board[command.getRow() + i][command.getColumn()];
            }

            if (tile.getTileType() === "DoubleWord" || tile.getTileType() === "Center") {
                doubleWord = true;
            } else if (tile.getTileType() === "TripleWord") {
                tripleWord = true;
            }

            score += tile.countTilePoint();
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

    isWordInBounds(command: CommandPlaceWord): boolean {
        return (((command.getOrientation() === "h") ?
            command.getColumn() : command.getRow()) + command.getWord().length) <= this.BOARD_LENGTH;
    }

    isWordCorrectlyOverlapping(command: CommandPlaceWord): boolean {
        let tile;
        let isNewWord = false;

        for (let i = 0; i < command.getWord().length; i++) {
            if (command.getOrientation() === "h") {
                tile = this.board[command.getRow()][command.getColumn() + i];
            } else {
                tile = this.board[command.getRow() + i][command.getColumn()];
            }

            if (tile.isEmpty()) {
                isNewWord = true;
            }
            else if (tile.getLetter().getCharacter() !== command.getWord().charAt(i).toUpperCase()) {
                console.log(tile.getLetter().getCharacter());
                console.log(command.getWord().charAt(i));
                return false;
            }
        }

        return isNewWord;
    }

    areAllWordsValid(command: CommandPlaceWord): boolean {
        for (let i = 0; i < this.BOARD_LENGTH; i++) {
            for (let j = 0; j < this.BOARD_LENGTH; j++) {
                let tile = this.board[i][j];

                if (!tile.isEmpty()) {

                    // Verify if the letter is the start of a vertically oriented word
                    if (((i === 0) || this.board[i - 1][j].isEmpty()) && !this.board[i + 1][j].isEmpty()) {
                        let word = "";
                        let row = i;

                        // Retrieve the word
                        while (!tile.isEmpty()) {
                            word += tile.getLetter().getCharacter();
                            tile = this.board[++row][j];
                        }

                        if (!Dictionary.isWordValid(word)) {
                            return false;
                        }
                    }

                    // Verify if the letter is the start of a horizontally oriented word
                    if (((j === 0) || this.board[i][j - 1].isEmpty()) && !this.board[i][j + 1].isEmpty()) {
                        let word = "";
                        let column = j;

                        // Retrieve the word
                        while (!tile.isEmpty()) {
                            word += tile.getLetter().getCharacter();
                            tile = this.board[i][++column];
                        }

                        if (!Dictionary.isWordValid(word)) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }
}
