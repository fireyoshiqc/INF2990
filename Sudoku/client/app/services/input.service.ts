/**
 * input.service.ts - Checks validity of sudoku grid entries
 *
 * @authors Félix Boulet, Mikaël Ferland
 * @date 2017/02/05
 */

import { Injectable } from '@angular/core';

@Injectable()
export class InputService {

    readonly GRID_SIZE = 9;
    readonly SQUARE_SIZE = 3;

    verifyEntry(event: any, grid: number[][], row: number, column: number): boolean {
        const pattern = /[1-9]/;

        // TODO: Implement moving through cases with arrow keys
        // Left / Up / Right / Down Arrow, Backspace, Delete keys
        if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 ||
            event.keyCode === 40 || event.keyCode === 8 || event.keyCode === 46) {
            return true;
        }

        if (!pattern.test(event.key)) {
            // prevent input
            event.preventDefault();
            return true;
        }
        else {
            return this.validate(Number.parseInt(event.key), grid, row, column);
        }
    }

    validate(entry: number, grid: number[][], row: number, column: number): boolean {
        return this.validateRow(entry, grid, row) &&
            this.validateColumn(entry, grid, column) &&
            this.validateSquare(entry, grid, row, column);
    }

    private validateRow(entry: number, grid: number[][], row: number): boolean {
        return grid[row].every(element => element !== entry);
    }

    private validateColumn(entry: number, grid: number[][], column: number) {
        return grid.every(row => row[column] !== entry);
    }

    private validateSquare(entry: number,
        grid: number[][], row: number, column: number) {
        let x: number, y: number;

        // coordinates for upper left corner of each square
        x = this.SQUARE_SIZE * Math.floor(row / this.SQUARE_SIZE);
        y = this.SQUARE_SIZE * Math.floor(column / this.SQUARE_SIZE);

        return grid.slice(x, x + this.SQUARE_SIZE).every(slicedRows =>
            slicedRows.slice(y, y + this.SQUARE_SIZE).every(element =>
                element !== entry));
    }
}
