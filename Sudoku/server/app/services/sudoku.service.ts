/**
 * generator.ts - Generates a valid Sudoku grid
 *
 * @authors Vincent Chassé, Pierre To
 * @date 2017/01/20
 */

// -------------------- HELPER FUNCTIONS -------------------------- //

export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// -------------------- END HELPER FUNCTIONS ----------------------- //

export enum Difficulty {
    Easy,
    Hard
}

export class Sudoku {
    public size: number;
    public grid: number[][];
    public difficulty: Difficulty;

    constructor(difficulty?: Difficulty) {
        if (difficulty) {
            this.difficulty = difficulty;
        }
        else {
            this.difficulty = Difficulty.Easy;
        }
        this.size = 9;
        this.grid = [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [4, 5, 6, 7, 8, 9, 1, 2, 3],
            [7, 8, 9, 1, 2, 3, 4, 5, 6],
            [2, 3, 4, 5, 6, 7, 8, 9, 1],
            [5, 6, 7, 8, 9, 1, 2, 3, 4],
            [8, 9, 1, 2, 3, 4, 5, 6, 7],
            [3, 4, 5, 6, 7, 8, 9, 1, 2],
            [6, 7, 8, 9, 1, 2, 3, 4, 5],
            [9, 1, 2, 3, 4, 5, 6, 7, 8]
        ];
    }

    public equals(other: Sudoku): boolean {

        if (this.size !== other.size) {
            return false;
        }

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] !== other.grid[i][j]) {
                    return false;
                }
            }
        }

        return true;
    }

    public isValid(): boolean {
        return this.areRowsColumnsValid() && this.areSquaresValid();
    }

    public areRowsColumnsValid(): boolean {
        let rowSet = new Set();
        let columnSet = new Set();

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                let rowNumber = this.grid[i][j];
                let columnNumber = this.grid[j][i];

                rowSet.add(rowNumber);
                columnSet.add(columnNumber);
            }

            // Check if a number is already in the same row or column, if yes, then the row/column cannot be valid.
            if (rowSet.size !== this.size || columnSet.size !== this.size) {
                return false;
            }
            rowSet.clear();
            columnSet.clear();
        }
        return true;
    }

    public areSquaresValid(): boolean {
        const SQUARE_SIZE = 3;
        let squareSet = new Set();
        let x: number, y: number;

        for (let square = 0; square < this.size; square++) {
            // Coordinates for upper left corner of each square
            x = SQUARE_SIZE * Math.floor(square / SQUARE_SIZE);
            y = SQUARE_SIZE * (square % SQUARE_SIZE);

            squareSet.add(this.grid[x][y]);
            squareSet.add(this.grid[x][y + 1]);
            squareSet.add(this.grid[x][y + 2]);
            squareSet.add(this.grid[x + 1][y]);
            squareSet.add(this.grid[x + 1][y + 1]);
            squareSet.add(this.grid[x + 1][y + 2]);
            squareSet.add(this.grid[x + 2][y]);
            squareSet.add(this.grid[x + 2][y + 1]);
            squareSet.add(this.grid[x + 2][y + 2]);

            // Check if a number is already in the same square, if yes, then the square cannot be valid.
            if (squareSet.size !== this.size) {
                return false;
            }
            squareSet.clear();
        }
        return true;
    }

    public countZeros(): number {
        let countZeros = 0;

        this.grid.forEach(row => {
            row.forEach(element => {
                if (element === 0) {
                    countZeros++;
                }
            });
        });

        return countZeros;
    }

    public toString(): string {
        let str = "\n";

        this.grid.forEach(row => {
            str += "\t" + row.toString() + "\n";
        });

        str = str.substr(0, str.length - 1);
        return str;
    }
}
