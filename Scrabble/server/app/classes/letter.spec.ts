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
            expect(letter).to.not.be.undefined;
            expect(letter).to.be.an.instanceOf(Letter);
            expect(letter.getLetter()).to.be.equal("A");
            expect(letter.getValue()).to.be.equal(1);
            done();
        });
    });
});
