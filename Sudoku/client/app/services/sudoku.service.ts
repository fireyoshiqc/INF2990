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
    playerName = "";
    isValid = false;

    constructor(private http: Http) { }

    getEasySudoku() {
        this.http.get('http://localhost:3002/getSudoku/easy')
            .toPromise()
            .then(reponse => {
                this.initialGrid = reponse.json().grid;
                this.inputGrid = reponse.json().grid;
                this.difficulty = reponse.json().difficulty ? "difficile" : "facile";
                this.isValid = false;
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
                this.isValid = false;
            })
            .catch(() => console.log("Could not get a hard sudoku."));
    }

    validateSudoku(callback: () => void) {
        this.http.post('http://localhost:3002/validateSudoku', this.inputGrid).toPromise().then(res => {
            this.isValid = (res.text() === "true");
            callback(); // Must be called after the Sudoku is validated (to end the timer, for example).
        })
            .catch(() => console.log("Could not validate sudoku."));
    }

    addScore(timeTaken: number) {
        this.http.put('http://localhost:3002/addScore',
            { "name": this.playerName, "time": timeTaken, "difficulty": this.difficulty })
            .toPromise().then(res => {
            // TODO: Error management and show scores
        })
            .catch(() => console.log("Could not add score."));
    }

    resetSudoku() {
        // Loop required for deep copy
        for (let i = 0; i < this.inputGrid.length; i++) {
            for (let j = 0; j < this.inputGrid[i].length; j++) {
                this.inputGrid[i][j] = this.initialGrid[i][j];
            }
            this.isValid = false;
        }
    }

    putEntry(entry: EntryNumber) {
        if (entry.row >= this.minIndex && entry.column >= this.minIndex &&
            entry.row <= this.maxIndex && entry.row <= this.maxIndex) {
            this.inputGrid[entry.row][entry.column] = entry.value;
        }
    }

    isGridFull(): boolean {
        return this.inputGrid.find(row =>
            (row.find(column =>
                (column === 0)) === 0)) === undefined;
    }

    quitGame(): void {
        //Send beacon to server to signal name removal before page unload.
        let blob = new Blob([JSON.stringify({"name": this.playerName})], {type: 'application/json; charset=UTF-8'});
        navigator.sendBeacon('http://localhost:3002/removeName', blob);
    }
}

interface EntryNumber {
    value: number;
    row: number;
    column: number;
}
