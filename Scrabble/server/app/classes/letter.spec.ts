/**
 * letter.spec.ts
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/03/15
 */

import { Letter } from './letter';

import { expect } from 'chai';

describe('Letter', () => {

    let letter = new Letter("a");

    describe('Default constructor', () => {
        it('should construct a BoardTile object.', done => {
            expect(letter).to.exist;
            expect(letter).to.be.an.instanceOf(Letter);
            expect(letter.getCharacter()).to.be.equal("A");
            expect(letter.getValue()).to.be.equal(1);
            done();
        });

        it('should return the right value of W.', done => {
            let B = new Letter("W");
            expect(B).to.be.an.instanceOf(Letter);
            expect(B.getCharacter()).to.be.equal("W");
            expect(B.getValue()).to.be.equal(10);
            done();
        });

        it('should return the right value of J.', done => {
            let J = new Letter("J");
            expect(J).to.be.an.instanceOf(Letter);
            expect(J.getCharacter()).to.be.equal("J");
            expect(J.getValue()).to.be.equal(8);
            done();
        });

        it('should return the right value of a joker in a rack.', done => {
            let joker = new Letter("JOKER");
            expect(joker).to.be.an.instanceOf(Letter);
            expect(joker.getCharacter()).to.be.equal("JOKER");
            expect(joker.getValue()).to.be.equal(0);
            done();
        });

        it('should return the right value of joker used as a letter in the board.', done => {
            let jokerUsedAsA = new Letter("A", true);
            expect(jokerUsedAsA).to.be.an.instanceOf(Letter);
            expect(jokerUsedAsA.getCharacter()).to.be.equal("A");
            expect(jokerUsedAsA.isJokerUsedAsLetter()).to.be.true;
            expect(jokerUsedAsA.getValue()).to.be.equal(0);
            done();
        });
    });
});

