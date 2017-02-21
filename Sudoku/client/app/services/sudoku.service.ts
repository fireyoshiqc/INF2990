import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SudokuService {
    private readonly minIndex = 0;
    private readonly maxIndex = 8;
    initialGrid = [
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
    inputGrid = [
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
    difficulty: string;
    isValid = "false";
    invalidFields: HTMLInputElement[] = new Array<HTMLInputElement>();

    constructor(private http: Http) { }

    getEasySudoku() {
        this.http.get('http://localhost:3002/getSudoku/easy')
            .toPromise()
            .then(reponse => {
                this.initialGrid = reponse.json().grid;
                this.inputGrid = reponse.json().grid;
                this.difficulty = reponse.json().difficulty ? "difficile" : "facile";
            })
            .catch(() => console.log("Could not get a easy sudoku."));
    }

    getHardSudoku() {
        this.http.get('http://localhost:3002/getSudoku/hard')
            .toPromise()
            .then(reponse => {
                this.initialGrid = reponse.json().grid;
                this.inputGrid = reponse.json().grid;
                this.difficulty = reponse.json().difficulty ? "difficile" : "facile";
            })
            .catch(() => console.log("Could not get a hard sudoku."));
    }

    validateSudoku() {
        this.http.post('http://localhost:3002/validateSudoku', this.inputGrid).subscribe(res => {
            this.isValid = res.text();
        });
    }

    resetSudoku() {
        // Loop required for deep copy
        for (let i = 0; i < this.inputGrid.length; i++) {
            for (let j = 0; j < this.inputGrid[i].length; j++) {
                this.inputGrid[i][j] = this.initialGrid[i][j];
            }
        }
    }

    putEntry(entry: EntryNumber) {
        if (entry.row >= this.minIndex && entry.column >= this.minIndex &&
            entry.row <= this.maxIndex && entry.row <= this.maxIndex) {
            this.inputGrid[entry.row][entry.column] = entry.value;
        }
    }

    putInvalidField(invalidField: HTMLInputElement) {
        invalidField.classList.add("invalid");
        this.invalidFields.push(invalidField);
    }

    resetInvalidFields() {
        this.invalidFields.forEach(element => {
            element.classList.remove("invalid");
        });
        this.invalidFields = new Array<HTMLInputElement>();
    }

    formatSelectedTableCell(input : HTMLInputElement) {
        // Add .selected class to <input> and parent <td> element
        input.classList.add("inputSelected");
        input.parentElement.parentElement.classList.add("inputSelected");
    }

    unformatSelectedTableCell(input : HTMLInputElement) {
        // Remove .selected class to <input> and parent <td> element
        input.classList.remove("inputSelected");
        input.parentElement.parentElement.classList.remove("inputSelected");
    }
}

interface EntryNumber {
    value: number;
    row: number;
    column: number;
}
