import { Component } from '@angular/core';
import { SudokuService } from '../services/sudoku.service';
import { StopwatchService } from '../services/stopwatch.service';
import { InputService } from '../services/input.service';

@Component({
    selector: 'sudoku-grid',
    templateUrl: '/assets/templates/sudokuGrid.component.html',
    providers: [SudokuService, StopwatchService, InputService]
})
export class SudokuGridComponent {
    initialGrid : number[][];
    inputGrid : number[][];
    isValid : string;
    difficulty : string;

    constructor(private sudokuService: SudokuService,
                private stopwatchService: StopwatchService,
                private inputService: InputService) {
        this.initialGrid = sudokuService.initialGrid;
        this.inputGrid = sudokuService.initialGrid;
    }

    getEasySudoku() {
        this.sudokuService.getEasySudoku().subscribe(sudoku => {
            this.initialGrid = sudoku.json().grid;
            this.inputGrid = sudoku.json().grid;
            this.difficulty = sudoku.json().difficulty ? "difficile" : "facile";
            this.stopwatchService.restart();
        });
        this.sudokuService.initialGrid = this.initialGrid;
        this.sudokuService.inputGrid = this.inputGrid;
    }

    getHardSudoku() {
        this.sudokuService.getHardSudoku().subscribe(sudoku => {
            this.initialGrid = sudoku.json().grid;
            this.inputGrid = sudoku.json().grid;
            this.difficulty = sudoku.json().difficulty ? "difficile" : "facile";
            this.stopwatchService.restart();
        });
        this.sudokuService.initialGrid = this.initialGrid;
        this.sudokuService.inputGrid = this.inputGrid;
    }

    validateSudoku() {
        this.sudokuService.validateSudoku(this.inputGrid).subscribe(response => {
            this.isValid = response.text();
            if (this.isValid === "true") {
                this.stopwatchService.stop();
            }
        });
    }

    resetSudoku() {
        this.inputGrid = this.sudokuService.resetSudoku();
        this.stopwatchService.restart();
    }

    getStopwatchVisibility(): boolean {
        return this.stopwatchService.isVisible();
    }

    toggleStopwatch() {
        this.stopwatchService.toggleVisibility();
    }

    putEntry(event: KeyboardEvent, row: number, column: number, inputField: HTMLInputElement) {

        // Left / Up / Right / Down Arrow
        if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 ||
            event.keyCode === 40) {
                // TODO: Implement moving through cases with arrow keys
        }

        // TODO: When a number is erased, verify the validity of other cases
        // Delete the number in the input case
        if (event.key === "Backspace" || event.key === "Delete") {
            inputField.value = null;
            inputField.classList.remove("invalid");
            this.inputGrid = this.sudokuService.putEntry(0, row, column);
        }
        // To add a number in the case
        else {
            if (this.inputService.verifyEntry(event, this.inputGrid, row, column)) {
                inputField.classList.remove("invalid");
            }
            else if (inputField.value.length === 0) {
                inputField.classList.add("invalid");
            }
            this.inputGrid = this.sudokuService.putEntry(Number.parseInt(event.key), row, column);
        }
    }
}
