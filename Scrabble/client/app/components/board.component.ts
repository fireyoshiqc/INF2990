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

export interface ICommandPlaceWord {
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

    public ngOnInit() {
        this.loadBoard();
    }

    public getBoard(): BoardTile[][] {
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

    public updateBoard(command: ICommandPlaceWord): void {
        let word = command.word;
        let rowIndex: number;
        let columnIndex: number;
        let tile: BoardTile;

         for (let i = 0; i < word.length; i++) {
            rowIndex = (command.orientation === "h") ? command.row : (command.row + i);
            columnIndex = (command.orientation === "h") ? (command.column + i) : command.column;
            tile = this.board[rowIndex][columnIndex];

            // Remove letter from board
            if (word[i] === "-") {
                tile.removeLetter();
            } else { // Add letter to board
                if (word[i] === word[i].toUpperCase()) {
                    tile.putLetter(new Letter(word[i], true));
                } else {
                    tile.putLetter(new Letter(word[i]));
                }
            }
         }
    }
}
