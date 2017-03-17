/**
 * scrabbleGame.ts - implements a scrabble game
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/03/15
 */

import { BoardTile, TileType } from './boardTile';
import { CommandPlaceWord } from './commandPlaceWord';
import * as data from '../../assets/objects/scrabbleBoard.json';

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

    // the word point is counted before the word is placed
    countWordPoint(command: CommandPlaceWord): number {
        let score = 0;
        let tile;
        let doubleWord = false, tripleWord = false;

        for (let i = 0; i < command.getWord().length; i++) {
            if (command.getOrientation() === "v") {
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

}
