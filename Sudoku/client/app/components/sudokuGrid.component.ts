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
    isValid: string;
    difficulty: string;

    constructor(private sudokuService: SudokuService,
        private stopwatchService: StopwatchService,
        private inputService: InputService) {
        this.sudokuService = sudokuService;
    }

    getSudokuService() {
        return this.sudokuService;
    }

    getEasySudoku() {
        this.stopwatchService.restart();
        this.sudokuService.getEasySudoku();
    }

    getHardSudoku() {
        this.stopwatchService.restart();
        this.sudokuService.getHardSudoku();
    }

    validateSudoku() {
        this.sudokuService.validateSudoku();
        if (this.sudokuService.isValid === "true") {
            this.stopwatchService.stop();
        }
    }

    resetSudoku() {
        this.sudokuService.resetSudoku();
        this.sudokuService.resetInvalidField();
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
        if (["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].indexOf(event.key) > -1) {
            // TODO: Implement moving through cases with arrow keys (next sprint)
        }

        // Delete the number in the input case
        if (event.key === "Backspace" || event.key === "Delete") {
            inputField.value = null;
            inputField.classList.remove("invalid");
            this.sudokuService.putEntry(0, row, column);
        }
        // To add a number in the case
        else {
            if (this.inputService.verifyEntry(event, this.sudokuService.inputGrid, row, column)) {
                inputField.classList.remove("invalid");
            }
            else if (inputField.value.length === 0) {
                // Adds invalid class to inputField (for blinking effect)
                this.sudokuService.putInvalidField(inputField);
            }
            this.sudokuService.putEntry(Number.parseInt(event.key), row, column);
        }
    }
}
