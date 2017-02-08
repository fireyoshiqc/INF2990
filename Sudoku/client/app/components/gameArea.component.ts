import { Component } from '@angular/core';

@Component({
    selector: 'game-area',
    template: `
    <div id="gameArea">
        <div id="buttonPanel">
            <button (click)="sudokuGrid.getEasySudoku()">EASY sudoku</button>
            <button (click)="sudokuGrid.getHardSudoku()">HARD sudoku</button>
            <button (click)="sudokuGrid.validateSudoku()">Validate sudoku</button>
            <!--<button (click)="sudokuGrid.resetSudoku()">Reset sudoku</button>-->
            <button (click)="sudokuGrid.toggleStopwatch()">
                {{ sudokuGrid.getStopwatchVisibility() ? "Hide" : "Show" }} stopwatch
            </button>
        </div>
        <sudoku-grid #sudokuGrid></sudoku-grid>
    </div>
    `
})
export class GameAreaComponent { }
