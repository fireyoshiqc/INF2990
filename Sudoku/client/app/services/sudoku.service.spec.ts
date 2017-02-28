import { SudokuService } from './sudoku.service';

import { Http } from '@angular/http';

import { expect } from 'chai';

describe('SudokuService', () => {

    let http: Http;
    let sudokuService : SudokuService = new SudokuService(http);

    describe('Default constructor ', () => {
        it('should construct the SudokuService.', done => {
            expect(sudokuService).to.not.be.undefined;
            expect(sudokuService).to.be.an.instanceof(SudokuService);
            done();
        });
    });

    describe('resetSudoku() ', () => {
        it('should reset sudoku grid to original.', done => {
            let initialGrid = sudokuService.initialGrid;
            let inputGrid = [[0, 2, 3, 4, 5, 0, 7, 8, 9],
                             [4, 0, 6, 7, 8, 9, 8, 0, 0],
                             [0, 8, 1, 0, 0, 3, 0, 5, 6],
                             [2, 0, 4, 5, 6, 7, 8, 9, 0],
                             [5, 6, 7, 8, 0, 1, 2, 3, 4],
                             [8, 9, 1, 2, 3, 4, 4, 6, 0],
                             [3, 4, 6, 6, 0, 8, 9, 1, 2],
                             [0, 7, 8, 9, 1, 2, 3, 4, 5],
                             [9, 1, 2, 3, 0, 5, 6, 0, 8]];
            sudokuService.inputGrid = inputGrid;

            sudokuService.resetSudoku();

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

    describe('putEntry()', () => {
        it('should insert a value in the corresponding cell of the sudoku grid.', done => {
            // Attempt to insert values with invalid row/column indexes
            sudokuService.putEntry({value: 3, row: -1, column:  4});
            sudokuService.putEntry({value: 3, row:  1, column: -4});
            sudokuService.putEntry({value: 3, row:  9, column:  4});
            sudokuService.putEntry({value: 3, row:  1, column:  9});

            let originalValue = sudokuService.inputGrid[1][4];
            sudokuService.putEntry({value: 3, row: 1, column: 4});

            expect(sudokuService.inputGrid[1][4]).to.equal(3);
            expect(sudokuService.inputGrid[1][4]).to.not.equal(originalValue);
            done();
        });
    });

    describe('isGridFull()', () => {
        it('should return false if the grid is not completed', done => {
            let inputGrid = [[0, 2, 3, 4, 5, 0, 7, 8, 9],
                             [4, 0, 6, 7, 8, 9, 8, 0, 0],
                             [0, 8, 1, 0, 0, 3, 0, 5, 6],
                             [2, 0, 4, 5, 6, 7, 8, 9, 0],
                             [5, 6, 7, 8, 0, 1, 2, 3, 4],
                             [8, 9, 1, 2, 3, 4, 4, 6, 0],
                             [3, 4, 6, 6, 0, 8, 9, 1, 2],
                             [0, 7, 8, 9, 1, 2, 3, 4, 5],
                             [9, 1, 2, 3, 0, 5, 6, 0, 8]];
            sudokuService.inputGrid = inputGrid;
            expect(sudokuService.isGridFull()).to.be.false;
            done();
        });

        it('should return true if the grid is completed (full)', done => {
            let inputGrid = [[1, 2, 3, 4, 5, 6, 7, 8, 9],
                            [4, 5, 6, 7, 8, 9, 1, 2, 3],
                            [7, 8, 9, 1, 2, 3, 4, 5, 6],
                            [2, 3, 4, 5, 6, 7, 8, 9, 1],
                            [5, 6, 7, 8, 9, 1, 2, 3, 4],
                            [8, 9, 1, 2, 3, 4, 5, 6, 7],
                            [3, 4, 5, 6, 7, 8, 9, 1, 2],
                            [6, 7, 8, 9, 1, 2, 3, 4, 5],
                            [9, 1, 2, 3, 4, 5, 6, 7, 8]];
            sudokuService.inputGrid = inputGrid;
            expect(sudokuService.isGridFull()).to.be.true;
            done();
        });
    });
});
