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
    sudokus: Array<Sudoku>;
    private sudokuRandomizer: SudokuRandomizer;
    private tileRemover: TileRemover;
    private readonly SUDOKU_STORAGE_SIZE = 3;

    constructor() {
        this.sudokuRandomizer = new SudokuRandomizer();
        this.tileRemover = new TileRemover();
        this.sudokus = [];

        for (let i = 0; i < this.SUDOKU_STORAGE_SIZE; i++) {
            this.sudokus.push(this.tileRemover.getUniqueSolutionSudoku(
                this.sudokuRandomizer.getRandomizedSudoku(new Sudoku(Difficulty.Easy))));

            this.sudokus.push(this.tileRemover.getUniqueSolutionSudoku(
                this.sudokuRandomizer.getRandomizedSudoku(new Sudoku(Difficulty.Hard))));
        }
    }

    getSudoku(difficulty: Difficulty): Sudoku {
        let sudoku;
        let index = this.sudokus.findIndex(s => s.difficulty === difficulty);

        if (index === -1) {
            this.generateNewSudoku(difficulty);
            sudoku = this.sudokus.pop(); // newly generated sudoku is necessarily at the end of the array
        }
        else {
            sudoku = this.sudokus[index];
            this.sudokus.splice(index, 1);

            // Delay below is artificial to show that generation is non-blocking when sudokus are available
            setTimeout(() => { this.generateNewSudoku(difficulty); }, 5000);
        }

        return sudoku;
    }

    generateNewSudoku(difficulty: Difficulty): void {
        let sudoku = this.tileRemover.getUniqueSolutionSudoku(
            this.sudokuRandomizer.getRandomizedSudoku(new Sudoku(difficulty)));
        this.sudokus.push(sudoku);
    }

    verifySudoku(sudokuGrid: number[][]): boolean {
        let sudoku = new Sudoku();
        sudoku.grid = sudokuGrid;

        return sudoku.isValid();
    }
}
