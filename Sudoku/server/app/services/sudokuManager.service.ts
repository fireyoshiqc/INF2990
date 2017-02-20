/**
 * sudokuManager.ts - Manages sudoku requests for generation and verification
 *
 * @authors Vincent Chassé, Pierre To
 * @date 2017/01/27
 */

import { Sudoku, Difficulty } from './sudoku.service';
import { SudokuRandomizer } from './sudokuRandomizer.service';
import { TileRemover } from './tileRemover.service';

export class SudokuManager {
    easySudokus: Array<Sudoku>;
    hardSudokus: Array<Sudoku>;
    private sudokuRandomizer: SudokuRandomizer;
    private tileRemover: TileRemover;
    private readonly SUDOKU_STORAGE_SIZE = 3;

    constructor() {
        this.sudokuRandomizer = new SudokuRandomizer();
        this.tileRemover = new TileRemover();
        this.easySudokus = [];
        this.hardSudokus = [];
        for (let i = 0; i < this.SUDOKU_STORAGE_SIZE; i++) {
            this.easySudokus.push(this.tileRemover.getUniqueSolutionSudoku(
                this.sudokuRandomizer.getRandomizedSudoku(new Sudoku(Difficulty.Easy))));
            this.hardSudokus.push(this.tileRemover.getUniqueSolutionSudoku(
            this.sudokuRandomizer.getRandomizedSudoku(new Sudoku(Difficulty.Hard))));
        }
    }

    getEasySudoku(): Sudoku {
        let sudoku;
        if (this.easySudokus.length === 0) {
            this.generateNewSudoku(Difficulty.Easy);
            sudoku = this.easySudokus.pop();
        }
        else {
            sudoku = this.easySudokus.pop();
            setTimeout(() => { this.generateNewSudoku(Difficulty.Easy); }, 5000);
        }
        return sudoku;
    }

    getHardSudoku(): Sudoku {
        let sudoku;
        if (this.hardSudokus.length === 0) {
            this.generateNewSudoku(Difficulty.Hard);
            sudoku = this.hardSudokus.pop();
        }
        else {
            sudoku = this.hardSudokus.pop();
            setTimeout(() => { this.generateNewSudoku(Difficulty.Hard); }, 5000);
        }

        return sudoku;
    }

    generateNewSudoku(difficulty: Difficulty): void {
        let sudoku = this.tileRemover.getUniqueSolutionSudoku(this.sudokuRandomizer
            .getRandomizedSudoku(new Sudoku(difficulty)));
        if (difficulty === Difficulty.Easy) {
            this.easySudokus.push(sudoku);
        }
        else {
            this.hardSudokus.push(sudoku);
        }
    }

    verifySudoku(sudokuGrid: number[][]): boolean {
        let sudoku = new Sudoku();

        sudoku.grid = sudokuGrid;

        return sudoku.isValid();
    }
}
