/**
 * tileRemover.ts - Removes tiles in a sudoku and assure it has an unique solution
 *
 * @authors Vincent Chassé, Erica Bugden
 * @date 2017/02/06
 */

import { Sudoku, Difficulty, getRandomInt } from './sudoku.service';

export class TileRemover {

    readonly SQUARE_SIZE = 3;
    readonly NUM_EMPTY_TILES_EASY = 30;
    readonly NUM_EMPTY_TILES_HARD = 50;
    private sudoku: Sudoku;

    setSudoku(sudoku: Sudoku): void {
        this.sudoku = sudoku;
    }

    getUniqueSolutionSudoku(sudoku: Sudoku): Sudoku {
        this.sudoku = sudoku;
        let tilesToRemove = (this.sudoku.difficulty === Difficulty.Easy) ?
            this.NUM_EMPTY_TILES_EASY : this.NUM_EMPTY_TILES_HARD;
        let possibleIndexes: Array<number> = Array.apply(null, Array(81)).map(
            function (value: number, index: number) { return index; });
        let removedIndexes = new Array();
        let removedValues = new Array();

        const MAX_TRIES = 30;
        let tries = 0;

        while (tilesToRemove > 0) {
            let tileToRemove = possibleIndexes[getRandomInt(0, possibleIndexes.length - 1)];
            let row = Math.floor(tileToRemove / 9);
            let column = tileToRemove % 9;

            if (this.sudoku.grid[row][column] !== 0 && this.tileCanBeRemoved(row, column)) {
                removedValues.push(this.sudoku.grid[row][column]);
                this.sudoku.grid[row][column] = 0;
                removedIndexes.push(possibleIndexes.splice(tileToRemove, 1));
                tries = 0;
                tilesToRemove--;
            } else {
                tries++;

                if (tries > MAX_TRIES) {
                    tries = 0;
                    this.sudoku.grid[row][column] = removedValues.pop();
                    possibleIndexes.push(removedIndexes.pop());
                    tilesToRemove++;
                }
            }
        }

        return this.sudoku;
    }

    tileCanBeRemoved(row: number, column: number): boolean {
        let oldValue = this.sudoku.grid[row][column];

        for (let testValue = 1; testValue <= 9; testValue++) {
            if (testValue !== oldValue) {
                this.sudoku.grid[row][column] = testValue;

                if (this.isSolvable()) {
                    return false;
                }
            }
        }

        return true;
    }

    isSolvable(): boolean {
        let zerosIndexes = new Array<number>();

        for (let index = 0; index < this.sudoku.size * this.sudoku.size; index++) {
            let column = index % 9;
            let row = Math.floor(index / 9);

            if (this.sudoku.grid[row][column] === 0) {
                zerosIndexes.push(index);
            }
        }

        return this.solveSudoku(zerosIndexes);
    }

    private solveSudoku(zerosIndexes: Array<number>): boolean {
        if (zerosIndexes.length === 0) {
            return this.sudoku.isValid();
        }

        let index = zerosIndexes.shift();
        let column = index % 9;
        let row = Math.floor(index / 9);

        for (let value = 1; value <= this.sudoku.size; value++) {
            if (this.valueIsLegal(value, row, column)) {
                this.sudoku.grid[row][column] = value;

                if (this.solveSudoku(zerosIndexes.slice())) {
                    this.sudoku.grid[row][column] = 0;
                    return true;
                }
            }
        }
        this.sudoku.grid[row][column] = 0;

        return false;
    }

    valueIsLegal(entry: number, row: number, column: number): boolean {
        return this.validateRow(entry, row) &&
            this.validateColumn(entry, column) &&
            this.validateSquare(entry, row, column);
    }

    private validateRow(entry: number, row: number): boolean {
        return this.sudoku.grid[row].every(element => element !== entry);
    }

    private validateColumn(entry: number, column: number) {
        return this.sudoku.grid.every(row => row[column] !== entry);
    }

    private validateSquare(entry: number, row: number, column: number) {
        let x: number, y: number;
        // coordinates for upper left corner of each square
        x = this.SQUARE_SIZE * Math.floor(row / this.SQUARE_SIZE);
        y = this.SQUARE_SIZE * Math.floor(column / this.SQUARE_SIZE);

        return this.sudoku.grid.slice(x, x + this.SQUARE_SIZE).every(slicedRows =>
            slicedRows.slice(y, y + this.SQUARE_SIZE).every(element =>
                element !== entry));
    }
}
