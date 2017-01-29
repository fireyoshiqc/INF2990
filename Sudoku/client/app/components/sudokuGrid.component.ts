import { Component } from '@angular/core';
import { SudokuService } from '../services/sudoku.service';

@Component({
    selector: 'sudoku-grid',
    template: `
    <p>Le sudoku est valide : {{valide}} </p>
    <table>
        <tr *ngFor="let row of grid; let i = index">      
            <td *ngFor="let element of row; let j = index">

                <div *ngIf="element!=0"> 
                    {{element}} 
                </div>         

            </td>
        </tr>       
    </table>
    `,
    providers: [ SudokuService ]
})
export class SudokuGridComponent {
    grid = [ [0, 2, 3, 4, 5, 0, 7, 8, 9],
             [4, 0, 6, 7, 8, 9, 0, 0, 0],
             [0, 8, 0, 1, 0, 3, 0, 5, 6],
             [2, 0, 4, 5, 6, 7, 8, 9, 0],
             [5, 6, 7, 8, 0, 1, 2, 3, 4],
             [8, 0, 1, 2, 3, 4, 0, 6, 0],
             [3, 4, 0, 6, 0, 8, 9, 1, 2],
             [0, 7, 8, 9, 1, 2, 3, 4, 5],
             [9, 1, 2, 3, 0, 5, 6, 0, 8] ];
    valide = "";
    
    constructor(private sudokuService: SudokuService) {

    }

    getEasySudoku() {
        this.sudokuService.getEasySudoku().subscribe(sudoku => {
            this.grid = sudoku.json();
        });
    }

    getHardSudoku() {
        this.sudokuService.getHardSudoku().subscribe(sudoku => {
            this.grid = sudoku.json();
        });
    }

    validateSudoku() {
        this.sudokuService.validateSudoku(this.grid).subscribe(reponse => {
            this.valide = reponse.text();
        });
    }

    resetSudoku() {
        this.grid.forEach(row => {
                row.fill(0);
        });
        console.log("reset sudoku");
    }
}
