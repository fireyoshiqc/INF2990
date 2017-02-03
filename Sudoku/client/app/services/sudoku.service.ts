import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SudokuService {
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

    constructor(private http: Http) { }

    getEasySudoku() {
        return this.http.get('http://localhost:3002/getSudoku/easy')
            .map(res => res);
    }

    getHardSudoku() {
        return this.http.get('http://localhost:3002/getSudoku/hard')
            .map(res => res);
    }

    validateSudoku(grid: number[][]) {
        return this.http.post('http://localhost:3002/validateSudoku', grid)
            .map(res => res);
    }

    resetSudoku() : number[][] {
        this.grid.forEach(row => {
            row.fill(0);
        });

        return this.grid;
    }
}
