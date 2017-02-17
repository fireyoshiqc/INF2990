import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SudokuService {
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

    invalidField: HTMLInputElement[] = new Array<HTMLInputElement>();

    constructor(private http: Http) { }

    getEasySudoku() {
        this.http.get('http://localhost:3002/getSudoku/easy').subscribe(res => {
            this.initialGrid = res.json().grid;
            this.inputGrid = res.json().grid;
            this.difficulty = res.json().difficulty ? "difficile" : "facile";
        });
    }

    getHardSudoku() {
        this.http.get('http://localhost:3002/getSudoku/hard').subscribe(res => {
            this.initialGrid = res.json().grid;
            this.inputGrid = res.json().grid;
            this.difficulty = res.json().difficulty ? "difficile" : "facile";
        });
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
        this.inputGrid[entry.row][entry.column] = entry.value;
    }

    putInvalidField(invalidField: HTMLInputElement) {
        invalidField.classList.add("invalid");
        this.invalidField.push(invalidField);
    }

    resetInvalidField() {
        this.invalidField.forEach(element => {
            element.classList.remove("invalid");
        });
        this.invalidField = new Array<HTMLInputElement>();
    }
}

interface EntryNumber {
    value: number;
    row: number;
    column: number;
}
