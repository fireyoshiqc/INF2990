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

    it('should create component', () => expect(comp).to.not.be.undefined );

    describe('A sudoku grid', () => {
        it('should only contain zeroes when reseted', done => {
            comp.resetSudoku();

            let containsOnlyZeros: boolean;
            containsOnlyZeros = true;
            for (let i = 0; i < comp.grid.length; i++) {
                for (let j = 0; j < comp.grid[0].length; j++) {
                    if (comp.grid[i][j] !== 0) {
                        containsOnlyZeros = false;
                        break;
                    }
                }
            }

            expect(containsOnlyZeros).to.equal(true);
            done();
        });
    });

});
