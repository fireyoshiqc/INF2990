/**
 * tileRemover.ts - Test the sudoku tile remover
 *
 * @authors Vincent Chassé, Erica Bugden
 * @date 2017/02/06
 */

import { Sudoku, Difficulty } from './sudoku.service';
import { TileRemover } from './tileRemover.service';

import { expect } from 'chai';

describe('TileRemover', () => {

    describe('getUniqueSolutionSudoku()', () => {
        let easySudoku = new Sudoku(Difficulty.Easy);
        let hardSudoku = new Sudoku(Difficulty.Hard);
        let tileRemover = new TileRemover();
        tileRemover.setSudoku(easySudoku);
        easySudoku = tileRemover.getUniqueSolutionSudoku(easySudoku);

        it('should be solvable (easy sudoku)', () => {
            expect(tileRemover.isSolvable()).to.be.true;
        });
        it('should be solvable (easy sudoku)', () => {
            expect(easySudoku.countZeros()).to.equal(tileRemover.NUM_EMPTY_TILES_EASY);
        });

        tileRemover.setSudoku(hardSudoku);
        hardSudoku = tileRemover.getUniqueSolutionSudoku(hardSudoku);

        it('should be solvable (hard sudoku)', () => {
            expect(tileRemover.isSolvable()).to.be.true;
        });
        it('should be solvable (hard sudoku)', () => {
            expect(hardSudoku.countZeros()).to.equal(tileRemover.NUM_EMPTY_TILES_HARD);
        });
    });

    describe('tileCanBeRemoved()', () => {
        let testGrid: number[][] = [
            [0, 0, 3, 4, 5, 6, 7, 8, 0],
            [4, 5, 6, 7, 8, 9, 1, 2, 3],
            [7, 8, 9, 1, 2, 3, 4, 5, 6],
            [2, 3, 4, 5, 6, 7, 8, 9, 1],
            [5, 6, 7, 8, 9, 1, 2, 3, 4],
            [8, 9, 1, 2, 3, 4, 5, 6, 7],
            [0, 4, 5, 6, 7, 8, 9, 1, 2],
            [6, 7, 8, 9, 1, 2, 3, 4, 5],
            [0, 1, 2, 3, 4, 5, 6, 7, 0]
        ];

        let sudoku = new Sudoku();

        sudoku.grid = testGrid;
        let tileRemover = new TileRemover();
        tileRemover.setSudoku(sudoku);

        it('should return true when a tile can be removed (grid still has unique solution)', () => {
            expect(tileRemover.tileCanBeRemoved(1, 1)).to.be.true;
        });
    });

    describe('isSolvable() ', () => {
        it('should return true when the grid is solvable ', done => {
            let testGrid: number[][] = [
                [8, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 3, 6, 0, 0, 0, 0, 0],
                [0, 7, 0, 0, 9, 0, 2, 0, 0],
                [0, 5, 0, 0, 0, 7, 0, 0, 0],
                [0, 0, 0, 0, 4, 5, 7, 0, 0],
                [0, 0, 0, 1, 0, 0, 0, 3, 0],
                [0, 0, 1, 0, 0, 0, 0, 6, 8],
                [0, 0, 8, 5, 0, 0, 0, 1, 0],
                [0, 9, 0, 0, 0, 0, 4, 0, 0]
            ];
            let sudoku = new Sudoku();
            sudoku.grid = testGrid;
            let tileRemover = new TileRemover();
            tileRemover.setSudoku(sudoku);
            expect(tileRemover.isSolvable()).to.be.true;
            done();
        });

        it('should return false when the grid is not solvable ', done => {
            let testGrid: number[][] = [
                [0, 0, 6, 2, 0, 0, 7, 1, 0],
                [0, 8, 3, 1, 0, 0, 4, 6, 5],
                [0, 0, 9, 0, 7, 0, 0, 0, 2],
                [0, 7, 2, 0, 9, 0, 3, 0, 0],
                [0, 9, 0, 4, 0, 7, 0, 2, 0],
                [0, 0, 8, 0, 1, 0, 5, 9, 0],
                [2, 0, 0, 0, 6, 0, 9, 0, 0],
                [9, 6, 7, 0, 0, 1, 2, 0, 0],
                [0, 3, 4, 0, 0, 8, 1, 0, 0]
            ];
            let sudoku = new Sudoku();

            sudoku.grid = testGrid;
            let tileRemover = new TileRemover();
            tileRemover.setSudoku(sudoku);
            expect(tileRemover.isSolvable()).to.be.false;
            done();
        });
    });

    describe('valueIsLegal()', () => {
        let testGrid: number[][] = [
            [0, 0, 3, 4, 5, 6, 7, 8, 0],
            [4, 5, 6, 7, 8, 9, 1, 2, 3],
            [7, 8, 9, 1, 2, 3, 4, 5, 6],
            [2, 3, 4, 5, 6, 7, 8, 9, 1],
            [5, 6, 7, 8, 9, 1, 2, 3, 4],
            [8, 9, 1, 2, 3, 4, 5, 6, 7],
            [0, 4, 5, 6, 7, 8, 9, 1, 2],
            [6, 7, 8, 9, 1, 2, 3, 4, 5],
            [0, 1, 2, 3, 4, 5, 6, 7, 0]
        ];

        let sudoku = new Sudoku();

        sudoku.grid = testGrid;
        let tileRemover = new TileRemover();
        tileRemover.setSudoku(sudoku);

        it('should return false when the row already contains the entered number', () => {
            //3 is already in the first row
            expect(tileRemover.valueIsLegal(3, 0, 0)).to.be.false;
        });
        it('should return false when the column already contains the entered number', () => {
            //2 is already in the first column
            expect(tileRemover.valueIsLegal(2, 0, 0)).to.be.false;
        });
        it('should return false when the square already contains the entered number', () => {
            //9 is already in the first square
            expect(tileRemover.valueIsLegal(9, 0, 0)).to.be.false;
        });
        it('should return false when the square already contains the entered number (non-trivial position)', () => {
            //9 is already in the last square (bottom-right, row is 8th, column is 8th)
            expect(tileRemover.valueIsLegal(9, 8, 8)).to.be.false;
        });
        it('should return true when the entry is not in the row, column or square', () => {
            //1 is the right number to enter
            expect(tileRemover.valueIsLegal(1, 0, 0)).to.be.true;
        });
    });
});
