/**
 * board.component.ts
 *
 * @authors Félix Boulet, Pierre To
 * @date 2017/02/05
 */

import { Component, OnInit } from '@angular/core';
import { BoardTile, TileType } from '../classes/boardTile';
import { Http } from '@angular/http';
import { Letter } from '../classes/letter';

export interface CommandPlaceWord {
    row: number;
    column: number;
    orientation: string;
    word: string;
}

@Component({
    moduleId: module.id,
    selector: 'board-comp',
    templateUrl: '/assets/templates/board.component.html'
})

export class BoardComponent implements OnInit {
    private board: BoardTile[][];
    private readonly BOARD_LENGTH = 15;

    constructor(private http: Http) {
        this.board = [];

        for (let i = 0; i < this.BOARD_LENGTH; i++) {
            this.board[i] = [];

            for (let j = 0; j < this.BOARD_LENGTH; j++) {
                this.board[i][j] = new BoardTile();
            }
        }
    }

    ngOnInit() {
        this.loadBoard();
    }

    getBoard(): BoardTile[][] {
        return this.board;
    }

    private loadBoard() {
        this.http.get("/assets/objects/scrabbleBoard.json")
            .map(res => res.json())
            .subscribe(res => {
                for (let i = 0; i < this.BOARD_LENGTH; i++) {
                    this.board[i] = [];

                    for (let j = 0; j < this.BOARD_LENGTH; j++) {
                        this.board[i][j] = new BoardTile(<TileType>res.array[i][j]);
                    }
                }
            });
    }

     placeWord(command: CommandPlaceWord): void {
        let word = command.word;

         for (let i = 0; i < word.length; i++) {
            if (command.orientation === "h") {
                this.board[command.row][command.column + i].putLetter(new Letter(word[i]));
            } else {
                this.board[command.row + i][command.column].putLetter(new Letter(word[i]));
            }
         }
    }
}
