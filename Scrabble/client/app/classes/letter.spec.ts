/**
 * letter.spec.ts
 *
 * @authors Pierre To
 * @date 2017/02/22
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
            expect(letter.getTexture()).to.be.equal("../../assets/textures/letters/A.png");
            expect(letter.isJokerUsedAsLetter()).to.be.false;
            done();
        });
    });
});
