/**
 * generator.ts - Generates a valid Sudoku grid
 *
 * @authors Vincent Chassé, Pierre To
 * @date 2017/01/20
 */

// To-do : inclure la grille dans la classe comme template
var sudokuGrid : number[][] = [ [1, 2, 3, 4, 5, 6, 7, 8, 9], 
                                [4, 5, 6, 7, 8, 9, 1, 2, 3], 
                                [7, 8, 9, 1, 2, 3, 4, 5, 6], 
                                [2, 3, 4, 5, 6, 7, 8, 9, 1], 
                                [5, 6, 7, 8, 9, 1, 2, 3, 4], 
                                [8, 9, 1, 2, 3, 4, 5, 6, 7], 
                                [3, 4, 5, 6, 7, 8, 9, 1, 2], 
                                [6, 7, 8, 9, 1, 2, 3, 4, 5], 
                                [9, 1, 2, 3, 4, 5, 6, 7, 8] ];

export function generateRandomValidIndexes() : number[] {
    let randomIndexes : number[] = [ 0, 0 ];

    let squareIndex = getRandomInt(0,2);

    randomIndexes[0] = 3 * squareIndex + getRandomInt(0,2);
    randomIndexes[1] = 3 * squareIndex + (randomIndexes[0] + getRandomInt(1,2)) % 3;

    return randomIndexes;

}

export function getRandomInt(min : number, max : number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
 
export class Sudoku {
    size: number;
    grid: number[][];

    constructor(aGrid: number[][] = sudokuGrid) { 
        this.grid = aGrid; 
        this.size = aGrid.length;
    }

    equals(other : Sudoku) : boolean {

        if (this.size != other.size) {
            return false;
        }

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] != other.grid[i][j]) {
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

    exchangeLines(line1 : number, line2 : number) : void {
        let temporary : number;

        for (let i = 0; i < this.size; i++) {
            temporary = this.grid[line1][i];
            this.grid[line1][i] = this.grid[line2][i];
            this.grid[line2][i] = temporary;
        }
    }

    flipHorizontally() : void {
        for (let i = 0; i < this.size; i++) {
            this.grid[i].reverse();
        }
    }

    flipVertically() : void {
        for (let i = 0; i < this.size/2; i++) {
            this.exchangeLines(i, this.size - i - 1);
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
        let valid = true;

        return valid;
    }
}