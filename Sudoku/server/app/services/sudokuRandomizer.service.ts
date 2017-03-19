/**
 * sudokuRandomizer.ts - Randomizes a sudoku grid using different operations
 *
 * @authors Vincent Chassé, Erica Bugden
 * @date 2017/02/06
 */

import { Sudoku, getRandomInt } from './sudoku.service';

interface IArrayCoordinates {
    x: number;
    y: number;
}

export class SudokuRandomizer {

    private sudoku: Sudoku;
    private readonly EXCHANGE_OPERATIONS_TABLE = [
        (x: number, y: number) => { this.exchangeColumns(x, y); },
        (x: number, y: number) => { this.exchangeRows(x, y); }
    ];
    private readonly FLIP_OPERATIONS_TABLE = [
        () => { this.flipAroundBackwardDiagonal(); },
        () => { this.flipAroundForwardDiagonal(); },
        () => { this.flipHorizontally(); },
        () => { this.flipVertically(); }
    ];
    private readonly RANDOM_OP_COUNT = 5000;

    public static generateRandomValidIndexes(): number[] {
        const SQUARE_SIZE = 3;
        let randomIndexes: number[] = [0, 0];
        let squareIndex = getRandomInt(0, 2);

        randomIndexes[0] = SQUARE_SIZE * squareIndex + getRandomInt(0, 2);
        randomIndexes[1] = SQUARE_SIZE * squareIndex + (randomIndexes[0] + getRandomInt(1, 2)) % SQUARE_SIZE;

        return randomIndexes;
    }

    public getSudoku(): Sudoku {
        return this.sudoku;
    }

    public setSudoku(sudoku: Sudoku): void {
        this.sudoku = sudoku;
    }

    public getRandomizedSudoku(sudoku: Sudoku): Sudoku {
        this.sudoku = sudoku;
        let randomInt: number;
        let numberOfOperations = this.EXCHANGE_OPERATIONS_TABLE.length + this.FLIP_OPERATIONS_TABLE.length;

        // Perform RANDOM_OP_COUNT operations on sudoku grid
        // Each operation (echange and flip) has equal chances to happen
        for (let i = 0; i < this.RANDOM_OP_COUNT; i++) {
            randomInt = getRandomInt(1, numberOfOperations);

            if (randomInt < 3) {
                let table = SudokuRandomizer.generateRandomValidIndexes();
                this.EXCHANGE_OPERATIONS_TABLE[randomInt - 1](table[0], table[1]);
            } else {
                this.FLIP_OPERATIONS_TABLE[randomInt - 3]();
            }
        }
        return this.sudoku;
    }

    public swap(coordinates1: IArrayCoordinates, coordinates2: IArrayCoordinates) {
        let temporary: number;

        temporary = this.sudoku.grid[coordinates1.x][coordinates1.y];
        this.sudoku.grid[coordinates1.x][coordinates1.y] = this.sudoku.grid[coordinates2.x][coordinates2.y];
        this.sudoku.grid[coordinates2.x][coordinates2.y] = temporary;
    }

    public exchangeColumns(column1: number, column2: number): void {

        for (let i = 0; i < this.sudoku.size; i++) {
            this.swap({ x: i, y: column1 }, { x: i, y: column2 });
        }
    }

    public exchangeRows(row1: number, row2: number): void {

        for (let i = 0; i < this.sudoku.size; i++) {
            this.swap({ x: row1, y: i }, { x: row2, y: i });
        }
    }

    public flipHorizontally(): void {
        for (let i = 0; i < this.sudoku.size; i++) {
            this.sudoku.grid[i].reverse();
        }
    }

    public flipVertically(): void {
        for (let i = 0; i < this.sudoku.size / 2; i++) {
            this.exchangeRows(i, this.sudoku.size - i - 1);
        }
    }

    public flipAroundBackwardDiagonal(): void {

        for (let i = 0; i < this.sudoku.size; i++) {
            // Start condition is j = i + 1 : Ignore the elements on diagonal
            for (let j = i + 1; j < this.sudoku.size; j++) {
                this.swap({ x: i, y: j }, { x: j, y: i });
            }
        }
    }

    public flipAroundForwardDiagonal(): void {
        let offset = this.sudoku.size - 1;

        for (let i = 0; i < this.sudoku.size; i++) {
            // End condition is j < this.size - i - 1 : Ignore the elements on diagonal
            for (let j = 0; j < this.sudoku.size - i - 1; j++) {
                this.swap({ x: i, y: j }, { x: offset - j, y: offset - i });
            }
        }
    }
}
