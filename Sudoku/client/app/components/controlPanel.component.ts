import { Component } from '@angular/core';
import { SudokuService } from '../services/sudoku.service';

@Component({
    selector: 'control-panel',
    template: `
        <div id="controlPanel">
            <button (click)="getEasySudoku()">Get EASY sudoku</button>
            <button (click)="getHardSudoku()">Get HARD sudoku</button>
            <button (click)="validateSudoku()">Validate sudoku</button>
            <button (click)="resetSudoku()">Reset sudoku</button>
        </div>
    `,
    providers: [ SudokuService ],
})
export class ControlPanelComponent {

    constructor(private sudokuService: SudokuService) {

    }

    getEasySudoku() {
        this.sudokuService.getEasySudoku().subscribe(sudoku => {
            console.log(sudoku.json());
        });
    }

    getHardSudoku() {
        this.sudokuService.getHardSudoku().subscribe(sudoku => {
            console.log(sudoku);
        });
    }

    validateSudoku() {
        this.sudokuService.validateSudoku().subscribe(sudoku => {
            console.log(sudoku);
        });
    }

    resetSudoku() {
        console.log("reset sudoku");
    }
}
