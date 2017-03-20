/**
 * letterStash.service.spec.ts
 *
 * @authors Vincent Chassé, Félix Boulet
 * @date 2017/03/19
 */

import { LetterStash } from './letterStash.service';
import { Letter } from '../classes/letter';

import { expect } from 'chai';

describe('LetterStash', () => {

    let testStash: LetterStash;

    describe('constructor()', () => {

        testStash = new LetterStash();

        it('should create an instance of LetterStash', done => {
            expect(testStash).to.exist;
            expect(testStash).to.be.an.instanceof(LetterStash);
            done();
        });

        it('should build a stash of 102 letters', done => {
            expect(testStash.getAmountLeft()).to.eql(102);
            done();
        });

    });

    describe('pickLetters()', () => {

        it('should return a set of random letters with the amount specified', done => {
            let pickedLetters = testStash.pickLetters(7);
            expect(pickedLetters.length).to.eql(7);
            for (let letter of pickedLetters) {
                expect(letter).to.be.an.instanceof(Letter);
            }
            done();
        });

    });

    describe('getAmountLeft()', () => {

        it('should return the amount of letters left in the stash', done => {
            expect(testStash.getAmountLeft()).to.eql(95);
            done();
        });

    });

    describe('exchangeLetters()', () => {

        it('should exchange the removed letters with fresh ones', done => {
            let lettersToExchange = ["a", "b"];
            let oldAmount = testStash.getAmountLeft();
            let exchangedLetters = testStash.exchangeLetters(lettersToExchange);
            expect(exchangedLetters.length).to.eql(2);
            for (let letter of exchangedLetters) {
                expect(letter).to.be.an.instanceof(Letter);
            }
            expect(testStash.getAmountLeft()).to.eql(oldAmount);
            done();
        });

        it('should exchange jokers identified by "*" without any issue', done => {
            let lettersToExchange = ["*", "*"];
            let oldAmount = testStash.getAmountLeft();
            let exchangedLetters = testStash.exchangeLetters(lettersToExchange);
            expect(exchangedLetters.length).to.eql(2);
            for (let letter of exchangedLetters) {
                expect(letter).to.be.an.instanceof(Letter);
            }
            expect(testStash.getAmountLeft()).to.eql(oldAmount);
            done();
        });

    });

});
