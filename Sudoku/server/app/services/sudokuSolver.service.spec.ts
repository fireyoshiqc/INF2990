/**
 * sudokuSolver.ts - Test the sudoku solver
 *
 * @authors Vincent Chassé, Erica Bugden
 * @date 2017/02/06
 */

import { Sudoku } from './sudokuGenerator.service';
import { SudokuSolver } from './sudokuSolver.service';

import { expect } from 'chai';

describe('SudokuRandomizer', () => {

    describe('isSolvable() ', () => {
        it('should return true when the grid is solvable ', done => {
            let testGrid: number[][] = [
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
            let sudoku = new Sudoku();

            sudoku.grid = testGrid;
            let sudokuSolver = new SudokuSolver(sudoku);

            expect(sudokuSolver.isSolvable()).to.be.true;
            done();
        });

        it('should return false when the grid is not solvable ', done => {
            let testGrid: number[][] = [
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
            let sudoku = new Sudoku();

            sudoku.grid = testGrid;
            let sudokuSolver = new SudokuSolver(sudoku);

            expect(sudokuSolver.isSolvable()).to.be.false;
            done();
        });
    });
});
