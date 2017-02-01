import { SudokuGridComponent } from './sudokuGrid.component';
import { SudokuService } from '../services/sudoku.service';
import { Http } from '@angular/http';

import { async } from '@angular/core/testing';

import { expect } from 'chai';

describe('SudokuGridComponent', () => {

    let comp: SudokuGridComponent;
    let serv: SudokuService;
    let http: Http;

    beforeEach(async(() => {
        serv = new SudokuService(http);
        comp = new SudokuGridComponent(serv);
    }));

    it('should create component', () => expect(comp).to.not.be.undefined);

    describe('A sudoku grid', () => {
        it('should only contain zeroes when reseted', done => {
            comp.resetSudoku();
            let containsOnlyZeros = true;
            containsOnlyZeros = comp.grid.every((x) => x.every((y) => y === 0));
            expect(containsOnlyZeros).to.be.true;
            done();
        });
    });
});
