/**
 * sudokuManager.ts - Test the manager of sudoku
 *
 * @authors Vincent Chassé, Pierre To
 * @date 2017/01/27
 */

import { SudokuManager } from './sudokuManager.service';
import { Difficulty } from './sudokuGenerator.service';

import { expect } from 'chai';

describe('SudokuManager', () => {

    let manager = new SudokuManager();

    describe('Default constructor ', () => {
        it('should construct a SudokuManager object with two arrays (easy/hard) of Sudoku', done => {

            let sudokusGenerated = true;
            let numberOfSudokus = 3;

            for (let i = 0; i < numberOfSudokus; i++) {
                if (!manager.easySudokus[i].isValid() || manager.easySudokus[i].difficulty !== Difficulty.Easy) {
                    sudokusGenerated = false;
                    break;
                }

                if (!manager.hardSudokus[i].isValid() || manager.hardSudokus[i].difficulty !== Difficulty.Hard) {
                    sudokusGenerated = false;
                    break;
                }
            }

            expect(sudokusGenerated).to.equal(true);
            done();
        });
    });

    describe('getEasySudoku() ', () => {
        it('should get an easy sudoku object from SudokuManager', done => {
            let sudokuGrid = manager.getEasySudoku();
            let countZeros = 0;

            sudokuGrid.forEach(row => {
                row.forEach(element => {
                    if (element === 0) {
                        countZeros++;
                    }
                });
            });

            // TODO : change countZeros to actual value for easy sudoku
            expect(countZeros).to.equal(0);
            done();
        });
    });

    describe('getHardSudoku() ', () => {
        it('should get a hard sudoku object from SudokuManager', done => {
            let sudokuGrid = manager.getHardSudoku();
            let countZeros = 0;

            sudokuGrid.forEach(row => {
                row.forEach(element => {
                    if (element === 0) {
                        countZeros++;
                    }
                });
            });

            // TODO : change countZeros to actual value for hard sudoku
            expect(countZeros).to.equal(0);
            done();
        });
    });

    describe('verifySudoku() ', () => {
        it('should return true when the grid is valid', done => {
            let validTestGrid : number[][] = [ [1, 2, 3, 4, 5, 6, 7, 8, 9],
                                               [4, 5, 6, 7, 8, 9, 1, 2, 3],
                                               [7, 8, 9, 1, 2, 3, 4, 5, 6],
                                               [2, 3, 4, 5, 6, 7, 8, 9, 1],
                                               [5, 6, 7, 8, 9, 1, 2, 3, 4],
                                               [8, 9, 1, 2, 3, 4, 5, 6, 7],
                                               [3, 4, 5, 6, 7, 8, 9, 1, 2],
                                               [6, 7, 8, 9, 1, 2, 3, 4, 5],
                                               [9, 1, 2, 3, 4, 5, 6, 7, 8] ];
            expect(manager.verifySudoku(validTestGrid)).to.equal(true);
            done();
        });
    });

    describe('verifySudoku() ', () => {
        it('should return false when the grid is invalid', done => {
            let invalidTestGrid : number[][] = [ [2, 2, 3, 4, 5, 6, 7, 8, 9],
                                                 [4, 5, 6, 7, 8, 9, 1, 2, 3],
                                                 [7, 8, 9, 1, 2, 3, 4, 5, 6],
                                                 [2, 3, 4, 5, 6, 7, 8, 9, 1],
                                                 [5, 6, 7, 8, 9, 1, 2, 3, 4],
                                                 [8, 9, 1, 2, 3, 4, 5, 6, 7],
                                                 [3, 4, 5, 6, 7, 8, 9, 1, 2],
                                                 [6, 7, 8, 9, 1, 2, 3, 4, 5],
                                                 [9, 1, 2, 3, 4, 5, 6, 7, 8] ];
            expect(manager.verifySudoku(invalidTestGrid)).to.equal(false);
            done();
        });
    });
});
