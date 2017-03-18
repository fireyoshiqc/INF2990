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

    describe('updateRack()', function () {
        it('should update the rack with new letters.', done => {
            let letters = ["A", "B", "C", "D", "E", "F", "G"];

            rackManager.updateRack(letters);
            expect(rackManager.getRackLetters().length).to.equal(RackManager.RACK_LENGTH);
            expect(rackManager.getRackLetters()[0].getCharacter()).to.equal("A");
            expect(rackManager.getRackLetters()[1].getCharacter()).to.equal("B");
            expect(rackManager.getRackLetters()[2].getCharacter()).to.equal("C");
            expect(rackManager.getRackLetters()[3].getCharacter()).to.equal("D");
            expect(rackManager.getRackLetters()[4].getCharacter()).to.equal("E");
            expect(rackManager.getRackLetters()[5].getCharacter()).to.equal("F");
            expect(rackManager.getRackLetters()[6].getCharacter()).to.equal("G");
            done();
        });
    });
});
