/**
 * sudokuRandomizer.ts - Randomizes a sudoku grid using different operations
 *
 * @authors Vincent Chassé, Erica Bugden
 * @date 2017/02/06
 */

import { Sudoku, getRandomInt } from './sudokuGenerator.service';

export class SudokuRandomizer {

    sudoku: Sudoku;

    constructor(sudoku: Sudoku) {
        this.sudoku = sudoku;
    }

    getRandomizedSudoku(): Sudoku {
        const RANDOM_OP_COUNT = 5000;
        let exchangeOperationsTable = [
            (x: number, y: number) => { this.exchangeColumns(x, y); },
            (x: number, y: number) => { this.exchangeRows(x, y); }
        ];
        let flipOperationsTable = [
            () => { this.flipAroundBackwardDiagonal(); },
            () => { this.flipAroundForwardDiagonal(); },
            () => { this.flipHorizontally(); },
            () => { this.flipVertically(); }
        ];
        let randomInt: number;
        let numberOfOperations = exchangeOperationsTable.length + flipOperationsTable.length;

        for (let i = 0; i < RANDOM_OP_COUNT; i++) {
            randomInt = getRandomInt(1, numberOfOperations);

            if (randomInt < 3) {
                let table = SudokuRandomizer.generateRandomValidIndexes();
                exchangeOperationsTable[randomInt - 1](table[0], table[1]);
            } else {
                flipOperationsTable[randomInt - 3]();
            }
        }
        return this.sudoku;
    }

    exchangeColumns(column1: number, column2: number): void {
        let temporary: number;

        for (let i = 0; i < this.sudoku.size; i++) {
            temporary = this.sudoku.grid[i][column1];
            this.sudoku.grid[i][column1] = this.sudoku.grid[i][column2];
            this.sudoku.grid[i][column2] = temporary;
        }
    }

    exchangeRows(row1: number, row2: number): void {
        let temporary: number;

        for (let i = 0; i < this.sudoku.size; i++) {
            temporary = this.sudoku.grid[row1][i];
            this.sudoku.grid[row1][i] = this.sudoku.grid[row2][i];
            this.sudoku.grid[row2][i] = temporary;
        }
    }

    flipHorizontally(): void {
        for (let i = 0; i < this.sudoku.size; i++) {
            this.sudoku.grid[i].reverse();
        }
    }

    flipVertically(): void {
        for (let i = 0; i < this.sudoku.size / 2; i++) {
            this.exchangeRows(i, this.sudoku.size - i - 1);
        }
    }

    flipAroundBackwardDiagonal(): void {
        let temporary: number;

        for (let i = 0; i < this.sudoku.size; i++) {
            // start condition is j = i + 1 : Ignore the elements on diagonal
            for (let j = i + 1; j < this.sudoku.size; j++) {
                temporary = this.sudoku.grid[i][j];
                this.sudoku.grid[i][j] = this.sudoku.grid[j][i];
                this.sudoku.grid[j][i] = temporary;
            }
        }
    }

    flipAroundForwardDiagonal(): void {
        let temporary: number;
        let offset = this.sudoku.size - 1;

        for (let i = 0; i < this.sudoku.size; i++) {
            // end condition is j < this.size - i - 1 : Ignore the elements on diagonal
            for (let j = 0; j < this.sudoku.size - i - 1; j++) {
                temporary = this.sudoku.grid[i][j];
                this.sudoku.grid[i][j] = this.sudoku.grid[offset - j][offset - i];
                this.sudoku.grid[offset - j][offset - i] = temporary;
            }
        }
    }

    static generateRandomValidIndexes(): number[] {
        const SQUARE_SIZE = 3;
        let randomIndexes: number[] = [0, 0];
        let squareIndex = getRandomInt(0, 2);

        randomIndexes[0] = SQUARE_SIZE * squareIndex + getRandomInt(0, 2);
        randomIndexes[1] = SQUARE_SIZE * squareIndex + (randomIndexes[0] + getRandomInt(1, 2)) % SQUARE_SIZE;

        return randomIndexes;
    }
}
