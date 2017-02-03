import { Injectable } from '@angular/core';

@Injectable()
export class InputService {

    readonly GRID_SIZE = 9;
    readonly SQUARE_SIZE = 3;

    validate(grid: number[][], row: number, column: number): boolean {
        return this.validateRow(grid, row) &&
               this.validateColumn(grid, column) && 
               this.validateSquare(grid, row, column);
    }

    private validateRow(grid: number[][], row: number): boolean {
        let rowSet = new Set();

        grid[row].forEach(element => {
            rowSet.add(element);
        });

        return rowSet.size === this.GRID_SIZE;
    }

    private validateColumn(grid: number[][], column: number) {
        let columnSet = new Set();

        grid.forEach(row => {
            columnSet.add(row[column]);
        });

        return columnSet.size === this.GRID_SIZE;
    }

    private validateSquare(grid: number[][], row: number, column: number) {

        let squareSet = new Set();
        let x: number, y: number;

        // coordinates for upper left corner of each square
        x = this.SQUARE_SIZE * Math.floor(row / this.SQUARE_SIZE);
        y = this.SQUARE_SIZE * Math.floor(column / this.SQUARE_SIZE);

        squareSet.add(grid[x][y]);
        squareSet.add(grid[x][y + 1]);
        squareSet.add(grid[x][y + 2]);
        squareSet.add(grid[x + 1][y]);
        squareSet.add(grid[x + 1][y + 1]);
        squareSet.add(grid[x + 1][y + 2]);
        squareSet.add(grid[x + 2][y]);
        squareSet.add(grid[x + 2][y + 1]);
        squareSet.add(grid[x + 2][y + 2]);

        // check if a number is already in the same square, if yes, then the square cannot be valid.
        return squareSet.size === this.GRID_SIZE;
    }
}
