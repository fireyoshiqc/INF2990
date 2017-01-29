import { Component } from '@angular/core';

@Component({
    selector: 'control-panel',
    template: `
        <div id="controlPanel">
            <button (click)="sudokuGrid.getEasySudoku()">Get EASY sudoku</button>
            <button (click)="sudokuGrid.getHardSudoku()">Get HARD sudoku</button>
            <button (click)="sudokuGrid.validateSudoku()">Validate sudoku</button>
            <button (click)="sudokuGrid.resetSudoku()">Reset sudoku</button>
        </div>
        <sudoku-grid #sudokuGrid></sudoku-grid>
    `
})
export class ControlPanelComponent {

}
