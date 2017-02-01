import { Component } from '@angular/core';

@Component({
    selector: 'control-panel',
    template: `
    <div id="controlPanel">
        <div id="buttonPanel">
            <button (click)="sudokuGrid.getEasySudoku()">EASY sudoku</button>
            <button (click)="sudokuGrid.getHardSudoku()">HARD sudoku</button>
            <button (click)="sudokuGrid.validateSudoku()">Validate sudoku</button>
            <button (click)="sudokuGrid.resetSudoku()">Reset sudoku</button>
        </div>
        <sudoku-grid #sudokuGrid></sudoku-grid>
    </div>
    `
})
export class ControlPanelComponent { }
