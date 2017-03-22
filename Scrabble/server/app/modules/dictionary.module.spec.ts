/**
 * dictionary.module.spec.ts
 *
 * @authors Mikael Ferland, Pierre To
 * @date 2017/03/22
 */

import { Dictionary } from './dictionary.module';

import { expect } from 'chai';

describe('Dictionary', () => {

    describe('isWordValid', () => {
        it('should validate an existing word (found in the dictionary).', done => {
            expect(Dictionary).to.not.be.undefined;
            expect(Dictionary.isWordValid("teSt")).to.be.true;
            expect(Dictionary.isWordValid("cHAt")).to.be.true;
            expect(Dictionary.isWordValid("TasSE")).to.be.true;
            done();
        });

        it('should invalidate a non-existing word (not found in the dictionary).', done => {
            expect(Dictionary.isWordValid("teS2")).to.be.false;
            expect(Dictionary.isWordValid("cHAttedEEuj")).to.be.false;
            expect(Dictionary.isWordValid("3")).to.be.false;
            done();
        });
    });
});
