/**
 * board.component.ts
 *
 * @authors Félix Boulet, Pierre To
 * @date 2017/02/05
 */

import { Component, OnInit } from '@angular/core';
import { BoardTile } from '../classes/boardTile';

@Component({
    moduleId: module.id,
    selector: 'board-comp',
    templateUrl: '/assets/templates/board.component.html'
})

export class BoardComponent implements OnInit {
    board: BoardTile[][];
    readonly BOARD_LENGTH = 15;

    ngOnInit() {

        this.board = [];

        for (let i = 0; i < this.BOARD_LENGTH; i++) {
            this.board[i] = [];

            for (let j = 0; j < this.BOARD_LENGTH; j++) {
                this.board[i][j] = new BoardTile("Basic");
            }
        }

        this.board[7][7] = new BoardTile("Center");

        this.board[0][0] = new BoardTile("TripleWord");
        this.board[0][7] = new BoardTile("TripleWord");
        this.board[0][14] = new BoardTile("TripleWord");
        this.board[7][0] = new BoardTile("TripleWord");
        this.board[7][14] = new BoardTile("TripleWord");
        this.board[14][0] = new BoardTile("TripleWord");
        this.board[14][7] = new BoardTile("TripleWord");
        this.board[14][14] = new BoardTile("TripleWord");

        this.board[1][1] = new BoardTile("DoubleWord");
        this.board[1][13] = new BoardTile("DoubleWord");
        this.board[2][2] = new BoardTile("DoubleWord");
        this.board[2][12] = new BoardTile("DoubleWord");
        this.board[3][3] = new BoardTile("DoubleWord");
        this.board[3][11] = new BoardTile("DoubleWord");
        this.board[4][4] = new BoardTile("DoubleWord");
        this.board[4][10] = new BoardTile("DoubleWord");
        this.board[10][4] = new BoardTile("DoubleWord");
        this.board[10][10] = new BoardTile("DoubleWord");
        this.board[11][3] = new BoardTile("DoubleWord");
        this.board[11][11] = new BoardTile("DoubleWord");
        this.board[12][2] = new BoardTile("DoubleWord");
        this.board[12][12] = new BoardTile("DoubleWord");
        this.board[13][1] = new BoardTile("DoubleWord");
        this.board[13][13] = new BoardTile("DoubleWord");

        this.board[1][5] = new BoardTile("TripleLetter");
        this.board[1][9] = new BoardTile("TripleLetter");
        this.board[5][1] = new BoardTile("TripleLetter");
        this.board[5][5] = new BoardTile("TripleLetter");
        this.board[5][9] = new BoardTile("TripleLetter");
        this.board[5][13] = new BoardTile("TripleLetter");
        this.board[9][1] = new BoardTile("TripleLetter");
        this.board[9][5] = new BoardTile("TripleLetter");
        this.board[9][9] = new BoardTile("TripleLetter");
        this.board[9][13] = new BoardTile("TripleLetter");
        this.board[13][5] = new BoardTile("TripleLetter");
        this.board[13][9] = new BoardTile("TripleLetter");

        this.board[0][3] = new BoardTile("DoubleLetter");
        this.board[0][11] = new BoardTile("DoubleLetter");
        this.board[2][6] = new BoardTile("DoubleLetter");
        this.board[2][8] = new BoardTile("DoubleLetter");
        this.board[3][0] = new BoardTile("DoubleLetter");
        this.board[3][7] = new BoardTile("DoubleLetter");
        this.board[3][14] = new BoardTile("DoubleLetter");
        this.board[6][2] = new BoardTile("DoubleLetter");
        this.board[6][6] = new BoardTile("DoubleLetter");
        this.board[6][8] = new BoardTile("DoubleLetter");
        this.board[6][12] = new BoardTile("DoubleLetter");
        this.board[7][3] = new BoardTile("DoubleLetter");
        this.board[7][11] = new BoardTile("DoubleLetter");
        this.board[8][2] = new BoardTile("DoubleLetter");
        this.board[8][6] = new BoardTile("DoubleLetter");
        this.board[8][8] = new BoardTile("DoubleLetter");
        this.board[8][12] = new BoardTile("DoubleLetter");
        this.board[11][0] = new BoardTile("DoubleLetter");
        this.board[11][7] = new BoardTile("DoubleLetter");
        this.board[11][14] = new BoardTile("DoubleLetter");
        this.board[12][6] = new BoardTile("DoubleLetter");
        this.board[12][8] = new BoardTile("DoubleLetter");
        this.board[14][3] = new BoardTile("DoubleLetter");
        this.board[14][11] = new BoardTile("DoubleLetter");
    }
}
