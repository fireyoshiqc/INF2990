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

    regexCheck(eventKey: string): boolean {
        const pattern = /[1-9]/;
        return pattern.test(eventKey);
    }

    validate(entry: EntryValidation): boolean {
        return this.validateRow(entry) &&
            this.validateColumn(entry) &&
            this.validateSquare(entry);
    }

    private validateRow(entry: EntryValidation): boolean {
        return entry.grid[entry.row].every(element => element !== entry.value);
    }

    private validateColumn(entry: EntryValidation) {
        return entry.grid.every(row => row[entry.column] !== entry.value);
    }

    private validateSquare(entry: EntryValidation) {
        let x: number, y: number;

        // coordinates for upper left corner of each square
        x = this.SQUARE_SIZE * Math.floor(entry.row / this.SQUARE_SIZE);
        y = this.SQUARE_SIZE * Math.floor(entry.column / this.SQUARE_SIZE);

        return entry.grid.slice(x, x + this.SQUARE_SIZE)
            .every(slicedRows => slicedRows.slice(y, y + this.SQUARE_SIZE)
                .every(element => element !== entry.value));
    }
}

interface EntryValidation {
    value: number;
    grid: number[][];
    row: number;
    column: number;
}
