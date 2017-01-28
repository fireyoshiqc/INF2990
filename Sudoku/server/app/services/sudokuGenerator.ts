/**
 * generator.ts - Generates a valid Sudoku grid
 *
 * @authors Vincent Chassé, Pierre To
 * @date 2017/01/20
 */

export function generateRandomValidIndexes() : number[] {
    let randomIndexes : number[] = [ 0, 0 ];

    let squareIndex = getRandomInt(0, 2);

    randomIndexes[0] = 3 * squareIndex + getRandomInt(0, 2);
    randomIndexes[1] = 3 * squareIndex + (randomIndexes[0] + getRandomInt(1, 2)) % 3;

    return randomIndexes;

}

export function getRandomInt(min : number, max : number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function sudokuToString(a: number[][]) : string {
    let str = "\n";

    for (let i = 0; i < a.length; i++) {
        str += "\t" + a[i].toString() + "\n";
    }

    str = str.substr(0, str.length - 1);
    return str;
}

export enum Difficulty {
    Easy,
    Hard
}

export class Sudoku {
    size: number;
    grid: number[][];
    difficulty : Difficulty;

    constructor(difficulty = Difficulty.Easy) {
        this.difficulty = difficulty;
        this.size = 9;
        this.grid = [ [1, 2, 3, 4, 5, 6, 7, 8, 9],
                      [4, 5, 6, 7, 8, 9, 1, 2, 3],
                      [7, 8, 9, 1, 2, 3, 4, 5, 6],
                      [2, 3, 4, 5, 6, 7, 8, 9, 1],
                      [5, 6, 7, 8, 9, 1, 2, 3, 4],
                      [8, 9, 1, 2, 3, 4, 5, 6, 7],
                      [3, 4, 5, 6, 7, 8, 9, 1, 2],
                      [6, 7, 8, 9, 1, 2, 3, 4, 5],
                      [9, 1, 2, 3, 4, 5, 6, 7, 8] ];
    }

    equals(other : Sudoku) : boolean {

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

    exchangeColumns(column1 : number, column2 : number) : void {
        let temporary : number;

        for (let i = 0; i < this.size; i++) {
            temporary = this.grid[i][column1];
            this.grid[i][column1] = this.grid[i][column2];
            this.grid[i][column2] = temporary;
        }
    }

    exchangeRows(row1 : number, row2 : number) : void {
        let temporary : number;

        for (let i = 0; i < this.size; i++) {
            temporary = this.grid[row1][i];
            this.grid[row1][i] = this.grid[row2][i];
            this.grid[row2][i] = temporary;
        }
    }

    flipHorizontally() : void {
        for (let i = 0; i < this.size; i++) {
            this.grid[i].reverse();
        }
    }

    flipVertically() : void {
        for (let i = 0; i < this.size / 2; i++) {
            this.exchangeRows(i, this.size - i - 1);
        }
    }

    flipAroundBackwardDiagonal() : void {
        let temporary : number;

        for (let i = 0; i < this.size; i++) {
            // start condition is j = i + 1 : Ignore the elements on diagonal
            for (let j = i + 1; j < this.size; j++) {
                temporary = this.grid[i][j];
                this.grid[i][j] = this.grid[j][i];
                this.grid[j][i] = temporary;
            }
        }
    }

    flipAroundForwardDiagonal() : void {
        let temporary : number;

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

    isValid() : boolean {
        return this.areRowsColumnsValid() && this.areSquaresValid();
    }

    areRowsColumnsValid() : boolean {
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

    areSquaresValid() : boolean {
        let squareSet = new Set();
        let x : number, y : number;

        for (let square = 0; square < this.size; square++) {
            // coordinates for upper left corner of each square
            x = 3 * Math.floor(square / 3);
            y = 3 * (square % 3);

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

    randomize() : void {
        let exchangeOperationsTable = [ (x : number, y : number) => {this.exchangeColumns(x, y); },
                                        (x : number, y : number) => {this.exchangeRows(x, y); } ];
        let flipOperationsTable = [ () => {this.flipAroundBackwardDiagonal(); },
                                    () => {this.flipAroundForwardDiagonal(); },
                                    () => {this.flipHorizontally(); },
                                    () => {this.flipVertically(); } ];
        let randomOperationCount = 5000;
        let randomInt : number;

        let numberOfOperations = exchangeOperationsTable.length + flipOperationsTable.length;

        for (let i = 0; i < randomOperationCount; i++) {
            randomInt = getRandomInt(1, numberOfOperations);

            if (randomInt < 3){
                let table = generateRandomValidIndexes();
                exchangeOperationsTable[randomInt - 1](table[0], table[1]);
            } else {
                flipOperationsTable[randomInt - 3]();
            }
        }
    }
}
