import { SudokuGridComponent } from './sudokuGrid.component';
import { SudokuService } from '../services/sudoku.service';
import { StopwatchService } from '../services/stopwatch.service';
import { InputService } from '../services/input.service';
import { Http } from '@angular/http';

import { async } from '@angular/core/testing';

import { expect } from 'chai';

describe('SudokuGridComponent', () => {

    let comp: SudokuGridComponent;
    let sudokuServ: SudokuService;
    let stopwatchServ: StopwatchService;
    let inputServ: InputService;
    let http: Http;

    beforeEach(async(() => {
        sudokuServ = new SudokuService(http);
        stopwatchServ = new StopwatchService();
        comp = new SudokuGridComponent(sudokuServ, stopwatchServ, inputServ);
    }));

    it('should create component', () => expect(comp).to.not.be.undefined);

    describe('resetSudoku() ', () => {
        it('should reset sudoku grid to original.', done => {
            let initialGrid = sudokuServ.initialGrid;
            let inputGrid = [[0, 2, 3, 4, 5, 0, 7, 8, 9],
                             [4, 0, 6, 7, 8, 9, 8, 0, 0],
                             [0, 8, 1, 0, 0, 3, 0, 5, 6],
                             [2, 0, 4, 5, 6, 7, 8, 9, 0],
                             [5, 6, 7, 8, 0, 1, 2, 3, 4],
                             [8, 9, 1, 2, 3, 4, 4, 6, 0],
                             [3, 4, 6, 6, 0, 8, 9, 1, 2],
                             [0, 7, 8, 9, 1, 2, 3, 4, 5],
                             [9, 1, 2, 3, 0, 5, 6, 0, 8]];
            sudokuServ.inputGrid = inputGrid;

            comp.resetSudoku();

            let isIdenticalToOriginalGrid = true;
            for (let i = 0; i < inputGrid.length; i++) {
                for (let j = 0; j < inputGrid[i].length; j++) {
                    if (inputGrid[i][j] !== initialGrid[i][j]) {
                        isIdenticalToOriginalGrid = false;
                        break;
                    }
                }
            }

            expect(isIdenticalToOriginalGrid).to.be.true;
            done();
        });
    });
});
