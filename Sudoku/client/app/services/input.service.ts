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

        // TODO: Implement moving through cases with arrow keys
        // Left / Up / Right / Down Arrow, Backspace, Delete keys
        if (["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", "Backspace", "Delete"].indexOf(event.key) > -1) {
            return true;
        }

        const pattern = /[1-9]/;

        // Checks if the key pressed is inside the pattern (1 to 9)
        if (pattern.test(event.key)) {
            return this.validate(Number.parseInt(event.key), grid, row, column);
        }
        else {
            // prevent input
            event.preventDefault();
            return true;
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

        return grid.slice(x, x + this.SQUARE_SIZE)
            .every(slicedRows => slicedRows.slice(y, y + this.SQUARE_SIZE)
            .every(element => element !== entry));
    }
}
