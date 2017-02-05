import { Component } from '@angular/core';
import { SudokuService } from '../services/sudoku.service';
import { StopwatchService } from '../services/stopwatch.service';

@Component({
    selector: 'sudoku-grid',
    templateUrl: '/assets/templates/sudokuGrid.component.html',
    providers: [SudokuService, StopwatchService]
})
export class SudokuGridComponent {
    grid : number[][];
    isValid : string;
    difficulty : string;

    constructor(private sudokuService: SudokuService, private stopwatchService: StopwatchService) {
        this.grid = sudokuService.grid;
    }

    getEasySudoku() {
        this.sudokuService.getEasySudoku().subscribe(sudoku => {
            this.grid = sudoku.json().grid;
            this.difficulty = sudoku.json().difficulty ? "difficile" : "facile";
            this.stopwatchService.restart();
        });
    }

    getHardSudoku() {
        this.sudokuService.getHardSudoku().subscribe(sudoku => {
            this.grid = sudoku.json().grid;
            this.difficulty = sudoku.json().difficulty ? "difficile" : "facile";
            this.stopwatchService.restart();
        });
    }

    validateSudoku() {
        this.sudokuService.validateSudoku(this.grid).subscribe(response => {
            this.isValid = response.text();
            if (this.isValid === "true") {
                this.stopwatchService.stop();
            }
        });
    }

    // TODO: Reset to the last grid obtained from the server (next sprint)
    resetSudoku() {
        this.grid = this.sudokuService.resetSudoku();
        this.stopwatchService.restart();
    }

    getStopwatchVisibility(): boolean {
        return this.stopwatchService.isVisible();
    }

    toggleStopwatch() {
        this.stopwatchService.toggleVisibility();
    }
}
