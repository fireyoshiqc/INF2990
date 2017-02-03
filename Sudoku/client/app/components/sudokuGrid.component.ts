import { Component } from '@angular/core';
import { SudokuService } from '../services/sudoku.service';

@Component({
    selector: 'sudoku-grid',
    templateUrl: '/assets/templates/sudokuGrid.component.html',
    providers: [SudokuService]
})
export class SudokuGridComponent {
    grid : number[][];
    isValid : string;
    difficulty : string;

    constructor(private sudokuService: SudokuService) {
        this.grid = sudokuService.grid;
    }

    getEasySudoku() {
        this.sudokuService.getEasySudoku().subscribe(sudoku => {
            this.grid = sudoku.json().grid;
            this.difficulty = sudoku.json().difficulty ? "difficile" : "facile";
        });
    }

    getHardSudoku() {
        this.sudokuService.getHardSudoku().subscribe(sudoku => {
            this.grid = sudoku.json().grid;
            this.difficulty = sudoku.json().difficulty ? "difficile" : "facile";
        });
    }

    validateSudoku() {
        this.sudokuService.validateSudoku(this.grid).subscribe(response => {
            this.isValid = response.text();
        });
    }

    // TODO: Reset to the last grid obtained from the server (next sprint)
    resetSudoku() {
        this.grid = this.sudokuService.resetSudoku();
    }
}
