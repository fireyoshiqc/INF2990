/**
 * sudokuManager.ts - Test the manager of sudoku
 *
 * @authors Vincent Chassé, Pierre To
 * @date 2017/01/27
 */

import { SudokuManager } from './sudokuManager.service';
import { Difficulty } from './sudoku.service';
import { TileRemover } from './tileRemover.service';
import { LoggerService } from './logger.service';

import { expect } from 'chai';

describe('SudokuManager', () => {
    let manager = new SudokuManager();
    let tileRemover = new TileRemover();

    describe('Default constructor ', () => {
        it('should construct a SudokuManager object with two arrays (easy/hard) of Sudoku', done => {
            let sudokusGenerated = true;
            let numberOfSudokus = 3;

            for (let i = 0; i < numberOfSudokus; i++) {
                let indexEasy = manager.getAllSudokus().findIndex(s => s.difficulty === Difficulty.Easy);
                let indexHard = manager.getAllSudokus().findIndex(s => s.difficulty === Difficulty.Hard);

                if (manager.getAllSudokus()[indexEasy].difficulty !== Difficulty.Easy) {
                    manager.getAllSudokus().splice(indexEasy, 1);
                    sudokusGenerated = false;
                    break;
                }

                if (manager.getAllSudokus()[indexHard].difficulty !== Difficulty.Hard) {
                    manager.getAllSudokus().splice(indexEasy, 1);
                    sudokusGenerated = false;
                    break;
                }
            }

            expect(sudokusGenerated).to.be.true;
            done();
        });
    });

    describe('getAllSudokus() ', () => {
        it('should return an array of sudokus', done => {
            expect(manager.getAllSudokus()).to.exist;
            expect(manager.getAllSudokus().length).to.be.greaterThan(0);
            done();
        });
    });

    describe('getEasySudoku() ', () => {
        it('should get an easy sudoku object from SudokuManager', done => {
            let sudoku = manager.getSudoku(Difficulty.Easy);

            expect(sudoku.countZeros()).to.equal(tileRemover.NUM_EMPTY_TILES_EASY);
            done();
        });
    });

    describe('getHardSudoku() ', () => {
        it('should get a hard sudoku object from SudokuManager', done => {
            let sudoku = manager.getSudoku(Difficulty.Hard);

            expect(sudoku.countZeros()).to.equal(tileRemover.NUM_EMPTY_TILES_HARD);
            done();
        });
    });

    describe('verifySudoku() ', () => {
        it('should return true when the grid is valid', done => {
            let validTestGrid: number[][] = [
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [4, 5, 6, 7, 8, 9, 1, 2, 3],
                [7, 8, 9, 1, 2, 3, 4, 5, 6],
                [2, 3, 4, 5, 6, 7, 8, 9, 1],
                [5, 6, 7, 8, 9, 1, 2, 3, 4],
                [8, 9, 1, 2, 3, 4, 5, 6, 7],
                [3, 4, 5, 6, 7, 8, 9, 1, 2],
                [6, 7, 8, 9, 1, 2, 3, 4, 5],
                [9, 1, 2, 3, 4, 5, 6, 7, 8]
            ];

            expect(manager.verifySudoku(validTestGrid)).to.be.true;
            done();
        });
    });

    describe('verifySudoku() ', () => {
        it('should return false when the grid is invalid', done => {
            let invalidTestGrid: number[][] = [
                [2, 2, 3, 4, 5, 6, 7, 8, 9],
                [4, 5, 6, 7, 8, 9, 1, 2, 3],
                [7, 8, 9, 1, 2, 3, 4, 5, 6],
                [2, 3, 4, 5, 6, 7, 8, 9, 1],
                [5, 6, 7, 8, 9, 1, 2, 3, 4],
                [8, 9, 1, 2, 3, 4, 5, 6, 7],
                [3, 4, 5, 6, 7, 8, 9, 1, 2],
                [6, 7, 8, 9, 1, 2, 3, 4, 5],
                [9, 1, 2, 3, 4, 5, 6, 7, 8]
            ];

            expect(manager.verifySudoku(invalidTestGrid)).to.be.false;
            done();
        });
    });

    describe('getNumberOfEasySudokus() ', () => {
        it('should return the number of easy sudokus', done => {
            expect(manager.getNumberOfEasySudokus()).to.be.greaterThan(0);
            done();
        });
    });

    describe('getNumberOfHardSudokus() ', () => {
        it('should return the number of hard sudokus', done => {
            expect(manager.getNumberOfHardSudokus()).to.be.greaterThan(0);
            done();
        });
    });

    describe('getLogger() ', () => {
        it('should return the logging service that is contained in the sudoku manager', done => {
            expect(manager.getLogger()).exist;
            expect(manager.getLogger()).to.be.an.instanceof(LoggerService);
            done();
        });
    });
});
