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
                    for (let j = 0; j < this.BOARD_LENGTH; j++) {
                        this.board[i][j] = new BoardTile(<TileType>res.array[i][j]);
                    }
                }
            });
    }

    public updateBoard(command: ICommandPlaceWord): void {
        let word = command.word;

        for (let i = 0; i < word.length; i++) {
            let tile = this.retrieveNextBoardTile(command, i);

            // Remove letter from board
            if (word[i] === "-") {
                tile.removeLetter();
            } else if (tile.getCharacter() === null) { // Add letter to board
                let jokerUsedAsLetter = (word[i] === word[i].toUpperCase());
                tile.putLetter(new Letter(word[i], jokerUsedAsLetter));
            }
        }
    }

    private retrieveNextBoardTile(command: ICommandPlaceWord, iteration: number): BoardTile {
        /* iteration = 0 : the starting tile of the word
           iteration = 1 : the second tile (i.e. second letter) of the word */
        let rowIndex = (command.orientation === "h") ? command.row : (command.row + iteration);
        let columnIndex = (command.orientation === "h") ? (command.column + iteration) : command.column;

        return this.board[rowIndex][columnIndex];
    }
}
