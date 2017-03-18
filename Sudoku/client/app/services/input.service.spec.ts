/**
 * input.service.spec.ts - Tests for validity checks from InputService.
 *
 * @authors Félix Boulet, Mikaël Ferland
 * @date 2017/02/05
 */

import { InputService } from './input.service';
import { expect } from 'chai';

describe('InputService', () => {
    let inputService: InputService;

    // First element removed, testing with 2 for column, 3 for row, 9 for square
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

    describe('Default constructor', () => {
        inputService = new InputService();

        it('should create an InputService', () => {
            expect(inputService).to.not.be.undefined;
            expect(inputService).to.be.an.instanceof(InputService);
        });
    });

    describe('isNumber', () => {
        it('should return true if the entered value is within the 1-9 range', () => {
            expect(inputService.isNumber("1")).to.be.true;
        });
        it('should return false if the entered value is not within the 1-9 range', () => {
            expect(inputService.isNumber("0")).to.be.false;
        });
        it('should return false if the entered value is not a number', () => {
            expect(inputService.isNumber("A")).to.be.false;
        });
    });

    describe('validate()', () => {
        it('should return false when the row already contains the entered number', () => {
            // 3 is already in the first row
            expect(inputService.validate({ value: 3, grid: testGrid, row: 0, column: 0 })).to.be.false;
        });

        it('should return false when the column already contains the entered number', () => {
            // 2 is already in the first column
            expect(inputService.validate({ value: 2, grid: testGrid, row: 0, column: 0 })).to.be.false;
        });

        it('should return false when the square already contains the entered number', () => {
            // 9 is already in the first square
            expect(inputService.validate({ value: 9, grid: testGrid, row: 0, column: 0 })).to.be.false;
        });

        it('should return false when the square already contains the entered number (non-trivial position)', () => {
            // 9 is already in the last square (bottom-right, row is 8th, column is 8th)
            expect(inputService.validate({ value: 9, grid: testGrid, row: 8, column: 8 })).to.be.false;
        });

        it('should return true when the entry is not in the row, column or square', () => {
            // 1 is the right number to enter
            expect(inputService.validate({ value: 1, grid: testGrid, row: 0, column: 0 })).to.be.true;
        });
    });
});
