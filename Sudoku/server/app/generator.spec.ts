/**
 * generator.ts - Test the generation of a valid Sudoku grid
 *
 * @authors Vincent Chassé, Pierre To
 * @date 2017/01/20
 */

import { Sudoku, generateRandomValidIndexes, getRandomInt } from './generator';

import { assert, expect } from 'chai'; 

describe('Sudoku', () => {

    describe('Default constructor ', () => {
        it('should construct a Sudoku object with template grid', done => {

            let testGrid : number[][] = [ [1, 2, 3, 4, 5, 6, 7, 8, 9], 
                                          [4, 5, 6, 7, 8, 9, 1, 2, 3], 
                                          [7, 8, 9, 1, 2, 3, 4, 5, 6], 
                                          [2, 3, 4, 5, 6, 7, 8, 9, 1], 
                                          [5, 6, 7, 8, 9, 1, 2, 3, 4], 
                                          [8, 9, 1, 2, 3, 4, 5, 6, 7], 
                                          [3, 4, 5, 6, 7, 8, 9, 1, 2], 
                                          [6, 7, 8, 9, 1, 2, 3, 4, 5], 
                                          [9, 1, 2, 3, 4, 5, 6, 7, 8] ];

            let sudoku1 = new Sudoku();
            let sudoku2 = new Sudoku(testGrid);

            expect(sudoku1.equals(sudoku2)).to.equal(true);
            done();
        });
    });

    describe('isEqual() ', () => {
        it('should return true if two grids are equal', done => {
            let grid1 : number[][] = [ [1, 2, 3], 
                                       [4, 5, 6], 
                                       [7, 8, 9] ];

            let grid2 : number[][] = [ [1, 2, 3], 
                                       [4, 5, 6], 
                                       [7, 8, 9] ];

            let sudoku1 = new Sudoku(grid1);
            let sudoku2 = new Sudoku(grid2);

            expect(sudoku1.equals(sudoku2)).to.equal(true);
            done();
        });
    });

    describe('!isEqual() ', () => {
        it('should return false if two grids are different', done => {
            let grid1 : number[][] = [ [1, 2, 3], 
                                       [4, 5, 6], 
                                       [7, 8, 9] ];

            let grid2 : number[][] = [ [1, 2, 3], 
                                       [4, 0, 6], 
                                       [7, 8, 0] ];

            let sudoku1 = new Sudoku(grid1);
            let sudoku2 = new Sudoku(grid2);

            expect(sudoku1.equals(sudoku2)).to.equal(false);
            done();
        });
    });

    describe('exchangeColumns() ', () => {
        it('should exchange two columns', done => {
            let aGrid : number[][] = [ [1, 2, 3], 
                                       [4, 5, 6], 
                                       [7, 8, 9] ];

            let sudoku = new Sudoku(aGrid);

            sudoku.exchangeColumns(0,2);

            let solutionGrid : number[][] = [ [3, 2, 1], 
                                              [6, 5, 4], 
                                              [9, 8, 7] ];

            expect(sudoku.equals(new Sudoku(solutionGrid))).to.equal(true);
            done();
        });
    });

    describe('exchangeLines() ', () => {
        it('should exchange two lines', done => {
            let aGrid : number[][] = [ [1, 2, 3], 
                                       [4, 5, 6], 
                                       [7, 8, 9] ];

            let sudoku = new Sudoku(aGrid);

            sudoku.exchangeLines(1,2);

            let solutionGrid : number[][] = [ [1, 2, 3], 
                                              [7, 8, 9], 
                                              [4, 5, 6] ];

            expect(sudoku.equals(new Sudoku(solutionGrid))).to.equal(true);
            done();
        });
    });

    describe('flipHorizontally() ', () => {
        it('should flip the grid horizontally', done => {
            let aGrid : number[][] = [ [1, 2, 3, 4], 
                                       [4, 3, 2, 1], 
                                       [5, 6, 7, 8],
                                       [8, 7, 6, 5] ];

            let sudoku = new Sudoku(aGrid);

            sudoku.flipHorizontally();

            let solutionGrid : number[][] = [ [4, 3, 2, 1], 
                                              [1, 2, 3, 4], 
                                              [8, 7, 6, 5],
                                              [5, 6, 7, 8] ];

            expect(sudoku.equals(new Sudoku(solutionGrid))).to.equal(true);
            done();
        });
    });

    describe('flipVertically() ', () => {
        it('should flip the grid vertically', done => {
            let aGrid : number[][] = [ [1, 2, 3, 4, 0], 
                                       [4, 3, 2, 1, 0], 
                                       [5, 6, 7, 8, 0],
                                       [8, 7, 6, 5, 0],
                                       [0, 0, 0, 0, 0] ];

            let sudoku = new Sudoku(aGrid);

            sudoku.flipVertically();

            let solutionGrid : number[][] = [ [0, 0, 0, 0, 0],
                                              [8, 7, 6, 5, 0], 
                                              [5, 6, 7, 8, 0], 
                                              [4, 3, 2, 1, 0],
                                              [1, 2, 3, 4, 0] ];

            expect(sudoku.equals(new Sudoku(solutionGrid))).to.equal(true);
            done();
        });
    });

    describe('flipAroundBackwardDiagonal() ', () => {
        it('should flip the grid around its backward diagonal', done => {
            let aGrid : number[][] = [ [1, 2, 3], 
                                       [4, 5, 6], 
                                       [7, 8, 9] ];

            let sudoku = new Sudoku(aGrid);

            sudoku.flipAroundBackwardDiagonal();

            let solutionGrid : number[][] = [ [1, 4, 7], 
                                              [2, 5, 8], 
                                              [3, 6, 9] ];

            expect(sudoku.equals(new Sudoku(solutionGrid))).to.equal(true);
            done();
        });
    });

    describe('flipAroundForwardDiagonal() ', () => {
        it('should flip the grid around its forward diagonal', done => {
            let aGrid : number[][] = [ [1, 2, 3], 
                                       [4, 5, 6], 
                                       [7, 8, 9] ];

            let sudoku = new Sudoku(aGrid);

            sudoku.flipAroundForwardDiagonal();

            let solutionGrid : number[][] = [ [9, 6, 3], 
                                              [8, 5, 2], 
                                              [7, 4, 1] ];

            expect(sudoku.equals(new Sudoku(solutionGrid))).to.equal(true);
            done();
        });
    });

    describe('getRandomInt() ', () => {
        it('should generate an integer between two values', done => {

            let min = 4, max = 10;
            let random : number = getRandomInt(min, max);

            expect(random >= min && random <= max).to.equal(true);
            
            done();
        });
    });



    describe('generateRandomValidIndexes() ', () => {
        it('should generate two valid indexes for switching rows or columns', done => {

            let indexes : number[] = generateRandomValidIndexes();

            expect(Math.floor(indexes[0]/3) == Math.floor(indexes[1]/3)).to.equal(true);
            
            done();
        });
    });

    describe('isValid() ', () => {
        it('should return true when the grid is valid', done => {

            let sudoku = new Sudoku();

            expect(sudoku.isValid()).to.equal(true);
            done();
        });
        
        it('should return false when the grid is invalid', done => {

            let testGrid : number[][] = [ [2, 2, 3, 4, 5, 6, 7, 8, 9], 
                                          [4, 5, 6, 7, 8, 9, 1, 2, 3], 
                                          [7, 8, 9, 1, 2, 3, 4, 5, 6], 
                                          [2, 3, 4, 5, 6, 7, 8, 9, 1], 
                                          [5, 6, 7, 8, 9, 1, 2, 3, 4], 
                                          [8, 9, 1, 2, 3, 4, 5, 6, 7], 
                                          [3, 4, 5, 6, 7, 8, 9, 1, 2], 
                                          [6, 7, 8, 9, 1, 2, 3, 4, 5], 
                                          [9, 1, 2, 3, 4, 5, 6, 7, 8] ];
                                                      
            let sudoku = new Sudoku(testGrid);

            expect(sudoku.isValid()).to.equal(false);
            done();
        });
    });
});