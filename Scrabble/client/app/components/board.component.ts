/**
 * board.component.ts
 *
 * @authors Félix Boulet, Pierre To
 * @date 2017/02/05
 */

import { Component, OnInit } from '@angular/core';
import { BoardTile, TileType } from '../classes/boardTile';
import { Http } from '@angular/http';

@Component({
    moduleId: module.id,
    selector: 'board-comp',
    templateUrl: '/assets/templates/board.component.html'
})

export class BoardComponent implements OnInit {
    board: BoardTile[][];
    readonly BOARD_LENGTH = 15;

    constructor(private http: Http) {

    }

    ngOnInit() {
        this.board = [];
        this.loadBoard();
    }

    private loadBoard() {
        this.http.get("/assets/objects/scrabbleBoard.json").map(res => res.json())
            .subscribe(res => {
                this.board = [];
                for (let i = 0; i < this.BOARD_LENGTH; i++) {
                    this.board[i] = [];
                    for (let j = 0; j < this.BOARD_LENGTH; j++) {
                        this.board[i][j] = new BoardTile(<TileType>res.array[i][j]);
                    }
                }
            });
    }
}
