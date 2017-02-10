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

    describe('A sudoku grid', () => {
        it('should only contain zeroes when reseted', done => {
            //TODO: Change the test to reflect the changes we made for inputServ
            comp.resetSudoku();
            let containsOnlyZeros = true;
            containsOnlyZeros = comp.getSudokuService().initialGrid.every((x) => x.every((y) => y === 0));
            expect(containsOnlyZeros).to.be.true;
            done();
        });
    });
});
