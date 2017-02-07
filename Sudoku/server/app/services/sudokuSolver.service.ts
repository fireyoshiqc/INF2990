/**
 * sudokuSolver.ts - Checks if the sudoku is solvable
 *
 * @authors Vincent Chassé, Erica Bugden
 * @date 2017/02/06
 */

import { Sudoku } from './sudokuGenerator.service';

export class SudokuSolver {

    sudokuGrid: number[][];
    sudokuSize : number;

    constructor(sudoku: Sudoku) {
        this.sudokuGrid = sudoku.grid;
        this.sudokuSize = sudoku.size;
    }

    isSolvable(): boolean {
        let zerosIndexes: Array<number>;
        for (let index = 0; index < this.sudokuSize * this.sudokuSize; index++) {
            let x = index % 9;
            let y = Math.floor(index / 9);
            if (this.sudokuGrid[x][y] === 0) {
                zerosIndexes.push(index);
            }
        }

        return this.solveSudoku(zerosIndexes);
    }

    solveSudoku(zerosIndexes: Array<number>): boolean {
        if (zerosIndexes.length === 0) {
            return true;
        }
        let index = zerosIndexes.pop();
        let x = index % 9;
        let y = Math.floor(index / 9);

        for (let value = 1; value <= this.sudokuSize; value++) {
            if (this.valueIsLegal(value, x, y)) {
                this.sudokuGrid[x][y] = value;
                if (this.solveSudoku(zerosIndexes)) {
                    return true;
                }
            }
        }
        this.sudokuGrid[x][y] = 0;
        return false;
    }

    valueIsLegal(entry: number, row: number, column: number): boolean {
        return this.validateRow(entry, row) &&
            this.validateColumn(entry, column) &&
            this.validateSquare(entry, row, column);
    }

    validateRow(entry: number, row: number): boolean {
        return this.sudokuGrid[row].every(element => element !== entry);
    }

    validateColumn(entry: number, column: number) {
        return this.sudokuGrid.every(row => row[column] !== entry);
    }

    validateSquare(entry: number, row: number, column: number) {
        let x: number, y: number;

        // coordinates for upper left corner of each square
        x = this.sudokuSize * Math.floor(row / this.sudokuSize);
        y = this.sudokuSize * Math.floor(column / this.sudokuSize);

        return this.sudokuGrid.slice(x, x + this.sudokuSize).every(slicedRows =>
            slicedRows.slice(y, y + this.sudokuSize).every(element =>
                element !== entry));
    }
}
