/**
 * sudokuManager.ts - Manages sudoku requests for generation and verification
 *
 * @authors Vincent Chassé, Pierre To
 * @date 2017/01/27
 */

import { Sudoku, Difficulty, getRandomInt } from './sudokuGenerator.service';
import { SudokuRandomizer } from './sudokuRandomizer.service';

export class SudokuManager {
    easySudokus: Array<Sudoku> = new Array<Sudoku>(3);
    hardSudokus: Array<Sudoku> = new Array<Sudoku>(3);

    constructor() {
        for (let i = 0; i < this.easySudokus.length; i++) {
            let sudokuRandomizer = new SudokuRandomizer(new Sudoku(Difficulty.Easy));
            this.easySudokus[i] = sudokuRandomizer.getRandomizedSudoku();

            let sudokuRandomizer2 = new SudokuRandomizer(new Sudoku(Difficulty.Hard));
            this.hardSudokus[i] = sudokuRandomizer2.getRandomizedSudoku();
        }
    }

    getEasySudoku(): Sudoku {
        let randomNumber = getRandomInt(0, 2);
        let sudoku = this.easySudokus[randomNumber];

        let sudokuRandomizer = new SudokuRandomizer(new Sudoku(Difficulty.Easy));
        this.easySudokus[randomNumber] = sudokuRandomizer.getRandomizedSudoku();

        return sudoku;
    }

    getHardSudoku(): Sudoku {
        let randomNumber = getRandomInt(0, 2);
        let sudoku = this.hardSudokus[randomNumber];

        let sudokuRandomizer = new SudokuRandomizer(new Sudoku(Difficulty.Hard));
        this.hardSudokus[randomNumber] = sudokuRandomizer.getRandomizedSudoku();

        return sudoku;
    }

    verifySudoku(sudokuGrid: number[][]): boolean {
        let sudoku = new Sudoku();

        sudoku.grid = sudokuGrid;

        return sudoku.isValid();
    }
}
