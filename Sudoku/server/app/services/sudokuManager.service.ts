/**
 * sudokuManager.ts - Manages sudoku requests for generation and verification
 *
 * @authors Vincent Chassé, Pierre To
 * @date 2017/01/27
 */

import { Sudoku, Difficulty } from './sudoku.service';
import { SudokuRandomizer } from './sudokuRandomizer.service';
import { TileRemover } from './tileRemover.service';
import { LoggerService } from './logger.service';

export class SudokuManager {
    private sudokus: Array<Sudoku>;
    private sudokuRandomizer: SudokuRandomizer;
    private tileRemover: TileRemover;
    private logger: LoggerService;
    private readonly SUDOKU_STORAGE_SIZE = 3;

    constructor() {
        this.sudokuRandomizer = new SudokuRandomizer();
        this.tileRemover = new TileRemover();
        this.logger = new LoggerService();
        this.sudokus = [];

        for (let i = 0; i < this.SUDOKU_STORAGE_SIZE; i++) {
            this.sudokus.push(this.tileRemover.getUniqueSolutionSudoku(
                this.sudokuRandomizer.getRandomizedSudoku(new Sudoku(Difficulty.Easy))));
            this.logger.logEvent("GÉNÉRATION", "Facile");

            this.sudokus.push(this.tileRemover.getUniqueSolutionSudoku(
                this.sudokuRandomizer.getRandomizedSudoku(new Sudoku(Difficulty.Hard))));
            this.logger.logEvent("GÉNÉRATION", "Difficile");
        }
    }

    public getSudoku(difficulty: Difficulty): Sudoku {
        let sudoku;
        let index = this.sudokus.findIndex(s => s.difficulty === difficulty);

        if (index === -1) {
            this.generateNewSudoku(difficulty);
            sudoku = this.sudokus.pop(); // Newly generated sudoku is necessarily at the end of the array
        }
        else {
            sudoku = this.sudokus[index];
            this.sudokus.splice(index, 1);

            // Delay below is artificial to show that generation is non-blocking when sudokus are available
            setTimeout(() => { this.generateNewSudoku(difficulty); }, 5000);
        }

        return sudoku;
    }

    public getAllSudokus(): Array<Sudoku> {
        return this.sudokus;
    }

    private generateNewSudoku(difficulty: Difficulty): void {
        let sudoku = this.tileRemover.getUniqueSolutionSudoku(
            this.sudokuRandomizer.getRandomizedSudoku(new Sudoku(difficulty)));
        this.sudokus.push(sudoku);
        if (difficulty === Difficulty.Easy) {
            this.logger.logEvent("GÉNÉRATION", "Facile");
        } else {
            this.logger.logEvent("GÉNÉRATION", "Difficile");
        }
    }

    public verifySudoku(sudokuGrid: number[][]): boolean {
        let sudoku = new Sudoku();
        sudoku.grid = sudokuGrid;

        return sudoku.isValid();
    }

    public getNumberOfEasySudokus(): number {
        let amount = 0;
        this.sudokus.forEach(sudoku => { if (sudoku.difficulty === Difficulty.Easy) { amount++; } });
        return amount;
    }

    public getNumberOfHardSudokus(): number {
        let amount = 0;
        this.sudokus.forEach(sudoku => { if (sudoku.difficulty === Difficulty.Hard) { amount++; } });
        return amount;
    }

    public getLogger(): LoggerService {
        return this.logger;
    }
}
