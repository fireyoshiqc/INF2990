import { SudokuGridComponent } from './sudokuGrid.component';
import { SudokuService } from '../services/sudoku.service';
import { StopwatchService } from '../services/stopwatch.service';
import { InputService } from '../services/input.service';

import { expect } from 'chai';

describe('SudokuGridComponent', () => {

    let sudokuService: SudokuService;
    let stopwatchService: StopwatchService;
    let inputService: InputService;

    let sudokuGridComponent = new SudokuGridComponent(sudokuService, stopwatchService, inputService)

    describe('Default constructor ', () => {
        it('should construct the SudokuGridComponent.', done => {
            expect(sudokuGridComponent).to.not.be.undefined;
            expect(sudokuGridComponent).to.be.an.instanceof(SudokuGridComponent);
            done();
        });
    });
});
