/**
 * sudokuRandomizer.ts - Test the sudoku randomizer
 *
 * @authors Vincent Chassé, Erica Bugden
 * @date 2017/02/06
 */

import { Sudoku } from './sudoku.service';
import { SudokuRandomizer } from './sudokuRandomizer.service';

import { expect } from 'chai';

describe('SudokuRandomizer', () => {

    describe('swap() ', () => {
        it('should exchange two elements', done => {
            let testGrid: number[][] = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ];

            let sudoku1 = new Sudoku();
            sudoku1.grid = testGrid;
            sudoku1.size = 3;

            let sudokuRandomizer = new SudokuRandomizer();
            sudokuRandomizer.setSudoku(sudoku1);
            sudokuRandomizer.swap({x: 0, y: 0}, {x: 2, y: 2});

            let solutionGrid: number[][] = [
                [9, 2, 3],
                [4, 5, 6],
                [7, 8, 1]
            ];

            let sudoku2 = new Sudoku();
            sudoku2.grid = solutionGrid;
            sudoku2.size = 3;

            expect(sudokuRandomizer.getSudoku().equals(sudoku2)).to.be.true;
            done();
        });
    });

    describe('exchangeColumns() ', () => {
        it('should exchange two columns', done => {
            let testGrid: number[][] = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ];

            let sudoku1 = new Sudoku();
            sudoku1.grid = testGrid;
            sudoku1.size = 3;

            let sudokuRandomizer = new SudokuRandomizer();
            sudokuRandomizer.setSudoku(sudoku1);
            sudokuRandomizer.exchangeColumns(0, 2);

            let solutionGrid: number[][] = [
                [3, 2, 1],
                [6, 5, 4],
                [9, 8, 7]
            ];

            let sudoku2 = new Sudoku();
            sudoku2.grid = solutionGrid;
            sudoku2.size = 3;

            expect(sudokuRandomizer.getSudoku().equals(sudoku2)).to.be.true;
            done();
        });
    });

    describe('exchangeRows() ', () => {
        it('should exchange two rows', done => {
            let testGrid: number[][] = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ];

            let sudoku1 = new Sudoku();
            sudoku1.grid = testGrid;
            sudoku1.size = 3;

            let sudokuRandomizer = new SudokuRandomizer();
            sudokuRandomizer.setSudoku(sudoku1);
            sudokuRandomizer.exchangeRows(1, 2);

            let solutionGrid: number[][] = [
                [1, 2, 3],
                [7, 8, 9],
                [4, 5, 6]
            ];
            let sudoku2 = new Sudoku();
            sudoku2.grid = solutionGrid;
            sudoku2.size = 3;

            expect(sudokuRandomizer.getSudoku().equals(sudoku2)).to.be.true;
            done();
        });
    });

    describe('flipHorizontally() ', () => {
        it('should flip the grid horizontally', done => {
            let testGrid: number[][] = [
                [1, 2, 3, 4],
                [4, 3, 2, 1],
                [5, 6, 7, 8],
                [8, 7, 6, 5]
            ];

            let sudoku1 = new Sudoku();
            sudoku1.grid = testGrid;
            sudoku1.size = 4;

            let sudokuRandomizer = new SudokuRandomizer();
            sudokuRandomizer.setSudoku(sudoku1);
            sudokuRandomizer.flipHorizontally();

            let solutionGrid: number[][] = [
                [4, 3, 2, 1],
                [1, 2, 3, 4],
                [8, 7, 6, 5],
                [5, 6, 7, 8]
            ];

            let sudoku2 = new Sudoku();
            sudoku2.grid = solutionGrid;
            sudoku2.size = 4;

            expect(sudokuRandomizer.getSudoku().equals(sudoku2)).to.be.true;
            done();
        });
    });

    describe('flipVertically() ', () => {
        it('should flip the grid vertically', done => {
            let testGrid: number[][] = [
                [1, 2, 3, 4, 0],
                [4, 3, 2, 1, 0],
                [5, 6, 7, 8, 0],
                [8, 7, 6, 5, 0],
                [0, 0, 0, 0, 0]
            ];

            let sudoku1 = new Sudoku();
            sudoku1.grid = testGrid;
            sudoku1.size = 5;

            let sudokuRandomizer = new SudokuRandomizer();
            sudokuRandomizer.setSudoku(sudoku1);
            sudokuRandomizer.flipVertically();

            let solutionGrid: number[][] = [
                [0, 0, 0, 0, 0],
                [8, 7, 6, 5, 0],
                [5, 6, 7, 8, 0],
                [4, 3, 2, 1, 0],
                [1, 2, 3, 4, 0]
            ];

            let sudoku2 = new Sudoku();
            sudoku2.grid = solutionGrid;
            sudoku2.size = 5;

            expect(sudokuRandomizer.getSudoku().equals(sudoku2)).to.be.true;
            done();
        });
    });

    describe('flipAroundBackwardDiagonal() ', () => {
        it('should flip the grid around its backward diagonal', done => {
            let testGrid: number[][] = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ];

            let sudoku1 = new Sudoku();
            sudoku1.grid = testGrid;
            sudoku1.size = 3;

            let sudokuRandomizer = new SudokuRandomizer();
            sudokuRandomizer.setSudoku(sudoku1);
            sudokuRandomizer.flipAroundBackwardDiagonal();

            let solutionGrid: number[][] = [
                [1, 4, 7],
                [2, 5, 8],
                [3, 6, 9]
            ];

            let sudoku2 = new Sudoku();
            sudoku2.grid = solutionGrid;
            sudoku2.size = 3;

            expect(sudokuRandomizer.getSudoku().equals(sudoku2)).to.be.true;
            done();
        });
    });

    describe('flipAroundForwardDiagonal() ', () => {
        it('should flip the grid around its forward diagonal', done => {
            let testGrid: number[][] = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ];

            let sudoku1 = new Sudoku();
            sudoku1.grid = testGrid;
            sudoku1.size = 3;

            let sudokuRandomizer = new SudokuRandomizer();
            sudokuRandomizer.setSudoku(sudoku1);
            sudokuRandomizer.flipAroundForwardDiagonal();

            let solutionGrid: number[][] = [
                [9, 6, 3],
                [8, 5, 2],
                [7, 4, 1]
            ];

            let sudoku2 = new Sudoku();
            sudoku2.grid = solutionGrid;
            sudoku2.size = 3;

            expect(sudokuRandomizer.getSudoku().equals(sudoku2)).to.be.true;
            done();
        });
    });

    describe('generateRandomValidIndexes() ', () => {
        it('should generate two valid indexes for switching rows or columns', done => {
            let indexes: number[] = SudokuRandomizer.generateRandomValidIndexes();

            expect(Math.floor(indexes[0] / 3)).to.equal(Math.floor(indexes[1] / 3));
            done();
        });
    });

    describe('randomize() ', () => {
        it('should alter the sudoku grid ', done => {
            let sudoku1 = new Sudoku();
            let sudoku2 = new Sudoku();

            let sudokuRandomizer = new SudokuRandomizer();
            sudokuRandomizer.getRandomizedSudoku(sudoku1);

            expect(sudokuRandomizer.getSudoku().equals(sudoku2)).to.be.false;
            done();
        });

        it('the sudoku should stay valid after randomization ', done => {
            let sudoku = new Sudoku();

            let sudokuRandomizer = new SudokuRandomizer();
            sudokuRandomizer.getRandomizedSudoku(sudoku);

            expect(sudokuRandomizer.getSudoku().isValid()).to.be.true;
            done();
        });
    });
});
