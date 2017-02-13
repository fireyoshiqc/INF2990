/**
 * generator.ts - Test the generation of a valid Sudoku grid
 *
 * @authors Vincent Chassé, Pierre To
 * @date 2017/01/20
 */

import { Sudoku, getRandomInt } from './sudoku.service';

import { expect } from 'chai';

describe('Sudoku', () => {

    describe('Default constructor ', () => {
        it('should construct a Sudoku object with template grid', done => {

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

            let sudoku1 = new Sudoku();
            let sudoku2 = new Sudoku();
            sudoku2.grid = testGrid;

            expect(sudoku1.equals(sudoku2)).to.be.true;
            done();
        });
    });

    describe('isEqual() ', () => {
        it('should return true if two grids are equal', done => {
            let grid1: number[][] = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ];

            let grid2: number[][] = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ];

            let sudoku1 = new Sudoku();
            sudoku1.grid = grid1;
            sudoku1.size = 3;
            let sudoku2 = new Sudoku();
            sudoku2.grid = grid2;
            sudoku2.size = 3;

            expect(sudoku1.equals(sudoku2)).to.be.true;
            done();
        });

        it('should return false if two grids are different', done => {
            let grid1: number[][] = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ];

            let grid2: number[][] = [
                [1, 2, 3],
                [4, 0, 6],
                [7, 8, 0]
            ];

            let sudoku1 = new Sudoku();
            sudoku1.grid = grid1;
            sudoku1.size = 3;
            let sudoku2 = new Sudoku();
            sudoku2.grid = grid2;
            sudoku2.size = 3;

            expect(sudoku1.equals(sudoku2)).to.be.false;
            done();
        });
    });

    describe('getRandomInt() ', () => {
        it('should generate an integer between two values', done => {
            let min = 4, max = 10;
            let random: number = getRandomInt(min, max);

            expect(random).to.be.at.least(min).and.at.most(max);
            done();
        });
    });

    describe('isValid() ', () => {
        it('should return true when the grid is valid', done => {
            let sudoku = new Sudoku();

            expect(sudoku.isValid()).to.be.true;
            done();
        });

        it('should return false when everything is invalid', done => {
            let testGrid: number[][] = [
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
            let sudoku = new Sudoku();
            sudoku.grid = testGrid;

            expect(sudoku.isValid()).to.be.false;
            done();
        });
    });

    describe('areRowsColumnsValid() ', () => {
        it('should return false when the rows are invalid even when the columns are valid', done => {
            let testGrid: number[][] = [
                [1, 1, 1, 1, 1, 1, 1, 1, 1],
                [2, 2, 2, 2, 2, 2, 2, 2, 2],
                [3, 3, 3, 3, 3, 3, 3, 3, 3],
                [4, 4, 4, 4, 4, 4, 4, 4, 4],
                [5, 5, 5, 5, 5, 5, 5, 5, 5],
                [6, 6, 6, 6, 6, 6, 6, 6, 6],
                [7, 7, 7, 7, 7, 7, 7, 7, 7],
                [8, 8, 8, 8, 8, 8, 8, 8, 8],
                [9, 9, 9, 9, 9, 9, 9, 9, 9]
            ];
            let sudoku = new Sudoku();
            sudoku.grid = testGrid;

            expect(sudoku.areRowsColumnsValid()).to.be.false;
            done();
        });

        it('should return false when the columns are invalid even when the rows are valid', done => {
            let testGrid: number[][] = [
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [1, 2, 3, 4, 5, 6, 7, 8, 9]
            ];
            let sudoku = new Sudoku();
            sudoku.grid = testGrid;

            expect(sudoku.areRowsColumnsValid()).to.be.false;
            done();
        });

    });

    describe('areSquaresValid() ', () => {
        it('should return false when only squares are invalid', done => {
            let testGrid: number[][] = [
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [2, 3, 4, 5, 6, 7, 8, 9, 1],
                [3, 4, 5, 6, 7, 8, 9, 1, 2],
                [4, 5, 6, 7, 8, 9, 1, 2, 3],
                [5, 6, 7, 8, 9, 1, 2, 3, 4],
                [6, 7, 8, 9, 1, 2, 3, 4, 5],
                [7, 8, 9, 1, 2, 3, 4, 5, 6],
                [8, 9, 1, 2, 3, 4, 5, 6, 7],
                [9, 1, 2, 3, 4, 5, 6, 7, 8]
            ];
            let sudoku = new Sudoku();
            sudoku.grid = testGrid;

            expect(sudoku.areSquaresValid()).to.be.false;
            done();
        });
    });


    describe('countZeros() ', () => {
        it('should return 10 when there are 10 zeros in the grid', done => {
            let testGrid: number[][] = [
                [0, 2, 0, 4, 5, 6, 7, 8, 9],
                [2, 3, 4, 5, 6, 7, 8, 9, 0],
                [3, 4, 5, 6, 7, 8, 9, 1, 2],
                [4, 5, 0, 7, 8, 9, 1, 2, 3],
                [5, 6, 7, 8, 9, 1, 2, 3, 4],
                [6, 7, 8, 9, 1, 2, 3, 4, 5],
                [7, 8, 0, 1, 2, 3, 4, 5, 6],
                [8, 0, 1, 2, 3, 4, 0, 0, 7],
                [9, 1, 2, 0, 4, 0, 6, 7, 8]
            ];
            let sudoku = new Sudoku();
            sudoku.grid = testGrid;

            expect(sudoku.countZeros()).to.equal(10);
            done();
        });
    });
});
