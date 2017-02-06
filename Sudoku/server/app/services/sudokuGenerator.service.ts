/**
 * generator.ts - Generates a valid Sudoku grid
 *
 * @authors Vincent Chassé, Pierre To
 * @date 2017/01/20
 */



//-------------------- HELPER FUNCTIONS --------------------------//

export function generateRandomValidIndexes(): number[] {
    const SQUARE_SIZE = 3;
    let randomIndexes: number[] = [0, 0];
    let squareIndex = getRandomInt(0, 2);

    randomIndexes[0] = SQUARE_SIZE * squareIndex + getRandomInt(0, 2);
    randomIndexes[1] = SQUARE_SIZE * squareIndex + (randomIndexes[0] + getRandomInt(1, 2)) % SQUARE_SIZE;

    return randomIndexes;
}

export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function sudokuToString(sudokuGrid: number[][]): string {
    let str = "\n";

    sudokuGrid.forEach(row => {
        str += "\t" + row.toString() + "\n";
    });

    str = str.substr(0, str.length - 1);
    return str;
}

//-------------------- END HELPER FUNCTIONS -----------------------//

export enum Difficulty {
    Easy,
    Hard
}

export class Sudoku {
    size: number;
    grid: number[][];
    difficulty: Difficulty;

    constructor(difficulty = Difficulty.Easy) {
        this.difficulty = difficulty;
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

    equals(other: Sudoku): boolean {

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

    exchangeColumns(column1: number, column2: number): void {
        let temporary: number;

        for (let i = 0; i < this.size; i++) {
            temporary = this.grid[i][column1];
            this.grid[i][column1] = this.grid[i][column2];
            this.grid[i][column2] = temporary;
        }
    }

    exchangeRows(row1: number, row2: number): void {
        let temporary: number;

        for (let i = 0; i < this.size; i++) {
            temporary = this.grid[row1][i];
            this.grid[row1][i] = this.grid[row2][i];
            this.grid[row2][i] = temporary;
        }
    }

    flipHorizontally(): void {
        for (let i = 0; i < this.size; i++) {
            this.grid[i].reverse();
        }
    }

    flipVertically(): void {
        for (let i = 0; i < this.size / 2; i++) {
            this.exchangeRows(i, this.size - i - 1);
        }
    }

    flipAroundBackwardDiagonal(): void {
        let temporary: number;

        for (let i = 0; i < this.size; i++) {
            // start condition is j = i + 1 : Ignore the elements on diagonal
            for (let j = i + 1; j < this.size; j++) {
                temporary = this.grid[i][j];
                this.grid[i][j] = this.grid[j][i];
                this.grid[j][i] = temporary;
            }
        }
    }

    flipAroundForwardDiagonal(): void {
        let temporary: number;
        let offset = this.size - 1;

        for (let i = 0; i < this.size; i++) {
            // end condition is j < this.size - i - 1 : Ignore the elements on diagonal
            for (let j = 0; j < this.size - i - 1; j++) {
                temporary = this.grid[i][j];
                this.grid[i][j] = this.grid[offset - j][offset - i];
                this.grid[offset - j][offset - i] = temporary;
            }
        }
    }

    isValid(): boolean {
        return this.areRowsColumnsValid() && this.areSquaresValid();
    }

    areRowsColumnsValid(): boolean {
        let rowSet = new Set();
        let columnSet = new Set();

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                let rowNumber = this.grid[i][j];
                let columnNumber = this.grid[j][i];

                rowSet.add(rowNumber);
                columnSet.add(columnNumber);
            }

            // check if a number is already in the same row or column, if yes, then the row/column cannot be valid.
            if (rowSet.size !== this.size || columnSet.size !== this.size) {
                return false;
            }
            rowSet.clear();
            columnSet.clear();
        }
        return true;
    }

    areSquaresValid(): boolean {
        const SQUARE_SIZE = 3;
        let squareSet = new Set();
        let x: number, y: number;

        for (let square = 0; square < this.size; square++) {
            // coordinates for upper left corner of each square
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

            // check if a number is already in the same square, if yes, then the square cannot be valid.
            if (squareSet.size !== this.size) {
                return false;
            }
            squareSet.clear();
        }
        return true;
    }

    randomize(): void {
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
                let table = generateRandomValidIndexes();
                exchangeOperationsTable[randomInt - 1](table[0], table[1]);
            } else {
                flipOperationsTable[randomInt - 3]();
            }
        }
    }

    isSolvable() : boolean {
        let zerosIndexes : Array<number>;
        for (let index = 0; index < this.size * this.size; index++) {
            let x = index % 9;
            let y = Math.floor(index / 9);
            if (this.grid[x][y] === 0) {
                zerosIndexes.push(index);
            }
        }

        return this.solveSudoku(zerosIndexes);
    }

    solveSudoku(zerosIndexes : Array<number>) : boolean {
        if (zerosIndexes.length === 0) {
            return true;
        }
        let index = zerosIndexes.pop();
        let x = index % 9;
        let y = Math.floor(index / 9);

        for (let value = 1; value <= this.size; value++) {
            if (this.valueIsLegal(value, x, y)) {
                this.grid[x][y] = value;
                if (this.solveSudoku(zerosIndexes)) {
                    return true;
                }
            }
        }
        this.grid[x][y] = 0;
        return false;
    }

    valueIsLegal(entry: number, row: number, column: number): boolean {
        return this.validateRow(entry, row) &&
            this.validateColumn(entry, column) &&
            this.validateSquare(entry, row, column);
    }

    validateRow(entry: number, row: number): boolean {
        return this.grid[row].every(element => element !== entry);
    }

    validateColumn(entry: number, column: number) {
        return this.grid.every(row => row[column] !== entry);
    }

    validateSquare(entry: number, row: number, column: number) {
        let x: number, y: number;

        // coordinates for upper left corner of each square
        x = this.size * Math.floor(row / this.size);
        y = this.size * Math.floor(column / this.size);

        return this.grid.slice(x, x + this.size).every(slicedRows =>
            slicedRows.slice(y, y + this.size).every(element =>
                element !== entry));
    }
}
