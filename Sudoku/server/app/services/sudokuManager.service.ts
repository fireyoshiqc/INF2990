/**
 * sudokuManager.ts - Manages sudoku requests for generation and verification
 *
 * @authors Vincent Chassé, Pierre To
 * @date 2017/01/27
 */

import { Sudoku, Difficulty, getRandomInt } from './sudoku.service';
import { SudokuRandomizer } from './sudokuRandomizer.service';
import { TileRemover } from './tileRemover.service';

export class SudokuManager {
    easySudokus: Array<Sudoku> = new Array<Sudoku>(3);
    hardSudokus: Array<Sudoku> = new Array<Sudoku>(3);
    private sudokuRandomizer: SudokuRandomizer;
    private tileRemover: TileRemover;

    constructor() {
        this.sudokuRandomizer = new SudokuRandomizer();
        this.tileRemover = new TileRemover();
        for (let i = 0; i < this.easySudokus.length; i++) {
            this.easySudokus[i] = this.tileRemover.getUniqueSolutionSudoku(
                this.sudokuRandomizer.getRandomizedSudoku(new Sudoku(Difficulty.Easy)));
            this.hardSudokus[i] = this.tileRemover.getUniqueSolutionSudoku(
                this.sudokuRandomizer.getRandomizedSudoku(new Sudoku(Difficulty.Hard)));
        }
    }

    getEasySudoku(): Sudoku {
        let randomNumber = getRandomInt(0, 2);
        let sudoku = this.easySudokus[randomNumber];
        this.easySudokus[randomNumber] = this.tileRemover.getUniqueSolutionSudoku(
            this.sudokuRandomizer.getRandomizedSudoku(new Sudoku(Difficulty.Easy)));

        return sudoku;
    }

    getHardSudoku(): Sudoku {
        let randomNumber = getRandomInt(0, 2);
        let sudoku = this.hardSudokus[randomNumber];
        this.hardSudokus[randomNumber] = this.tileRemover.getUniqueSolutionSudoku(
            this.sudokuRandomizer.getRandomizedSudoku(new Sudoku(Difficulty.Hard)));

        return sudoku;
    }

    verifySudoku(sudokuGrid: number[][]): boolean {
        let sudoku = new Sudoku();

        sudoku.grid = sudokuGrid;

        return sudoku.isValid();
    }
}
