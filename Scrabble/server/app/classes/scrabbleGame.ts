/**
 * scrabbleGame.ts - implements a scrabble game
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/03/15
 */

import { BoardTile, TileType } from './boardTile';
import * as data from '../../assets/objects/scrabbleBoard.json';

export class ScrabbleGame {
     private board: BoardTile[][];
     private readonly BOARD_LENGTH = 15;

     // TODO : letterStash

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

}
