/**
 * sudokuManager.ts - Manages sudoku requests for generation and verification
 *
 * @authors Vincent Chassé, Pierre To
 * @date 2017/01/27
 */

import { Sudoku, Difficulty, getRandomInt } from './sudokuGenerator.service';

export class SudokuManager {
    easySudokus : Array<Sudoku> = new Array<Sudoku>(3);
    hardSudokus : Array<Sudoku> = new Array<Sudoku>(3);

    constructor() {
        for (let i = 0; i < this.easySudokus.length; i++) {
            this.easySudokus[i] = new Sudoku(Difficulty.Easy);
            this.easySudokus[i].randomize();

            this.hardSudokus[i] = new Sudoku(Difficulty.Hard);
            this.hardSudokus[i].randomize();
        }
    }

    getEasySudoku() : number[][] {
        let randomNumber = getRandomInt(0, 2);

        let sudoku = this.easySudokus[randomNumber];

        this.easySudokus[randomNumber] = new Sudoku(Difficulty.Easy);
        this.easySudokus[randomNumber].randomize();

        return sudoku.grid;
    }

    getHardSudoku() : number[][] {
        let randomNumber = getRandomInt(0, 2);

        let sudoku = this.hardSudokus[randomNumber];

        this.hardSudokus[randomNumber] = new Sudoku(Difficulty.Hard);
        this.hardSudokus[randomNumber].randomize();

        return sudoku.grid;
    }

    verifySudoku(sudokuGrid : number[][]) : boolean {
        let sudoku = new Sudoku();
        sudoku.grid = sudokuGrid;
        return sudoku.isValid();
    }
}
