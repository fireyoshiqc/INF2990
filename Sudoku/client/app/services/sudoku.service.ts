import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SudokuService {

    private readonly HOST_NAME = "http://" + window.location.hostname;
    private readonly SERVER_PORT = ":3002";
    private readonly minIndex = 0;
    private readonly maxIndex = 8;
    public initialGrid = [
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
    public inputGrid = [
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
    public difficulty: string;
    public playerName = "";
    public isValid = false;

    constructor(private http: Http) { }

    public getEasySudoku(): void {
        this.http.get(this.HOST_NAME + this.SERVER_PORT + '/api/getSudoku/easy')
            .toPromise()
            .then(reponse => {
                this.initialGrid = reponse.json().grid;
                this.inputGrid = reponse.json().grid;
                this.difficulty = reponse.json().difficulty ? "difficile" : "facile";
                this.isValid = false;
            })
            .catch(() => console.log("Could not get a easy sudoku."));
    }

    public getHardSudoku(): void {
        this.http.get(this.HOST_NAME + this.SERVER_PORT + '/api/getSudoku/hard')
            .toPromise()
            .then(reponse => {
                this.initialGrid = reponse.json().grid;
                this.inputGrid = reponse.json().grid;
                this.difficulty = reponse.json().difficulty ? "difficile" : "facile";
                this.isValid = false;
            })
            .catch(() => console.log("Could not get a hard sudoku."));
    }

    public validateSudoku(callback: () => void): void {
        this.http.post(this.HOST_NAME + this.SERVER_PORT + '/api/validateSudoku', this.inputGrid)
            .toPromise()
            .then(res => {
                this.isValid = (res.text() === "true");
                callback(); // Must be called after the Sudoku is validated (to end the timer, for example).
            })
            .catch(() => console.log("Could not validate sudoku."));
    }

    public addScore(timeTaken: number): Promise<boolean> {
        let postPromise = new Promise((resolve, reject) => {
            this.http.put(this.HOST_NAME + this.SERVER_PORT + '/api/addScore',
                { "name": this.playerName, "time": timeTaken, "difficulty": this.difficulty }).toPromise()
                .then(res => resolve(res.json()))
                .catch((error) => reject());
        });
        return postPromise;
    }

    public getHighscores(showDirectly?: boolean): Promise<any> {
        let getPromise = new Promise((resolve, reject) => {
            this.http.get(this.HOST_NAME + this.SERVER_PORT + '/api/getHighscores').toPromise()
                .then(res => {
                    let highscores = res.json();

                    if (highscores.easy === undefined || highscores.hard === undefined) {
                        reject("Highscores request failed.");
                    }
                    else {
                        const easyScores: Array<any> = highscores.easy;
                        const hardScores: Array<any> = highscores.hard;
                        let isHighscore: boolean;

                        // Trying to find the current player's name in the top 3 highscores for each difficulty
                        if (this.difficulty === "facile") {
                            isHighscore = easyScores.find(element => (element.name === this.playerName)) !== undefined;
                        } else if (this.difficulty === "difficile") {
                            isHighscore = hardScores.find(element => (element.name === this.playerName)) !== undefined;
                        } else {
                            reject("Sudoku difficulty not set or wrong value. Could not get highscores.");
                        }
                        (isHighscore || showDirectly) ? resolve(highscores) : resolve(undefined);
                    }
                })
                .catch(() => reject("Could not get highscores."));
        });
        return getPromise;
    }

    public resetSudoku(): void {
        // Loop required for deep copy
        for (let i = 0; i < this.inputGrid.length; i++) {
            for (let j = 0; j < this.inputGrid[i].length; j++) {
                this.inputGrid[i][j] = this.initialGrid[i][j];
            }
            this.isValid = false;
        }
    }

    public putEntry(entry: IEntryNumber): void {
        if (entry.row >= this.minIndex && entry.column >= this.minIndex &&
            entry.row <= this.maxIndex && entry.row <= this.maxIndex) {
            this.inputGrid[entry.row][entry.column] = entry.value;
        }
    }

    public isGridFull(): boolean {
        // Tries to find an empty square (value of zero).
        return this.inputGrid.find(row =>
            (row.find(column =>
                (column === 0)) === 0)) === undefined;
    }

    public quitGame(): void {
        // Send beacon to server to signal name removal before page unload.
        let blob = new Blob([JSON.stringify({ "name": this.playerName })], { type: 'application/json; charset=UTF-8' });
        navigator.sendBeacon(this.HOST_NAME + this.SERVER_PORT + '/api/removeName', blob);
    }
}

interface IEntryNumber {
    value: number;
    row: number;
    column: number;
}
