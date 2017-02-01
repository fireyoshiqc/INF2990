import { Component } from '@angular/core';
import { SudokuService } from '../services/sudoku.service';

@Component({
    selector: 'sudoku-grid',
    template: `
    <div id="sudokuGrid">
        <div id="grid">
            <table>
                <tr *ngFor="let row of grid; let i = index">
                    <td *ngFor="let element of row; let j = index">
                        <div *ngIf="element!=0">
                            {{element}}
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <div id="infoPanel">
            <p><b>Pierre To</b></p>
            <p>Le sudoku est valide : {{isValid}} </p>
            <p>Niveau de difficulté : {{difficulty}} </p>
            <p>Timer : 0:00 </p>
        </div>
    </div>
    `,
    providers: [SudokuService]
})
export class SudokuGridComponent {
    grid = [
        [0, 2, 3, 4, 5, 0, 7, 8, 9],
        [4, 0, 6, 7, 8, 9, 0, 0, 0],
        [0, 8, 0, 1, 0, 3, 0, 5, 6],
        [2, 0, 4, 5, 6, 7, 8, 9, 0],
        [5, 6, 7, 8, 0, 1, 2, 3, 4],
        [8, 0, 1, 2, 3, 4, 0, 6, 0],
        [3, 4, 0, 6, 0, 8, 9, 1, 2],
        [0, 7, 8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 0, 5, 6, 0, 8]
    ];
    isValid = "";
    difficulty = "";

    constructor(private sudokuService: SudokuService) {

    }

    getEasySudoku() {
        this.sudokuService.getEasySudoku().subscribe(sudoku => {
            this.grid = sudoku.json();
            this.difficulty = "facile";
        });
    }

    getHardSudoku() {
        this.sudokuService.getHardSudoku().subscribe(sudoku => {
            this.grid = sudoku.json();
            this.difficulty = "difficile";
        });
    }

    validateSudoku() {
        this.sudokuService.validateSudoku(this.grid).subscribe(response => {
            this.isValid = response.text();
        });
    }

    // TODO: Reset to the last grid obtained from the server (next sprint)
    resetSudoku() {
        this.grid.forEach(row => {
            row.fill(0);
        });
    }
}
