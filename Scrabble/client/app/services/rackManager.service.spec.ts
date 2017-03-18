/**
 * rackManager.service.spec.ts
 *
 * @authors Mikael Ferland, Vincent Chassé
 * @date 2017/03/06
 */

import { RackManager } from './rackManager.service';
import { Letter } from '../classes/letter';

import { expect } from 'chai';

describe('RackManager', function () {

    let rackManager: RackManager;

    beforeEach(() => {
        rackManager = new RackManager();
    });

    describe('Default constructor', function () {
        it('should construct a rack manager.', done => {
            expect(rackManager).to.exist;
            expect(rackManager).to.be.instanceOf(RackManager);
            done();
        });
    });

    describe('getRack()', function () {
        it('should return a rack of size 7.', done => {
            expect(rackManager.getRackLetters().length).to.equal(RackManager.RACK_LENGTH);
            expect(rackManager.getRackLetters()[0]).to.be.instanceOf(Letter);
            done();
        });
    });

    describe('removeRackLetters()', function () {
        it('should remove letters from rack.', done => {
            expect(rackManager.getRackLetters().length).to.equal(RackManager.RACK_LENGTH);

            let letters = [rackManager.getRackLetters()[0].getCharacter(),
                           rackManager.getRackLetters()[1].getCharacter().toLowerCase(),
                           rackManager.getRackLetters()[2].getCharacter()];

            rackManager.removeRackLetters(letters);
            expect(rackManager.getRackLetters().length).to.equal(RackManager.RACK_LENGTH - 3);
            done();
        });
    });
});
