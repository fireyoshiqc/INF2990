/**
 * nameManager.service.ts - Tests for the server-side player name handling
 *
 * @authors Félix Boulet
 * @date 2017/03/06
 */

import { NameManagerService } from './nameManager.service';

import { expect } from 'chai';

describe('NameManagerService', () => {

    let testNameManager: NameManagerService;

    describe('constructor()', () => {

        it('should construct a name manager with an empty array of names', done => {
            testNameManager = new NameManagerService();
            expect(testNameManager).to.exist;
            expect(testNameManager).to.be.an.instanceof(NameManagerService);
            done();
        });

    });

    describe('validateName()', () => {

        it('should successfully add a name w/ correct structure that does not exist yet', done => {
            expect(testNameManager.validateName("Erica")).to.be.true;
            done();
        });
        it('should not add a name w/ correct structure that already exists', done => {
            expect(testNameManager.validateName("Erica")).to.be.false;
            done();
        });
        it('should not add a name shorter than 4 characters', done => {
            expect(testNameManager.validateName("Ayy")).to.be.false;
            done();
        });
        it('should not add a name w/ blank space at the beginning', done => {
            expect(testNameManager.validateName(" SpaceToTheLeft")).to.be.false;
            done();
        });
        it('should not add a name w/ blank space at the end', done => {
            expect(testNameManager.validateName("SpaceToTheRight ")).to.be.false;
            done();
        });

    });

    describe('removeName()', () => {

        it('should successfully remove a name that exists', done => {
            expect(testNameManager.removeName("Erica")).to.be.true;
            done();
        });
        it('should not remove a name that does not exist (anymore)', done => {
            expect(testNameManager.removeName("Erica")).to.be.false;
            done();
        });
        it('should not remove a name that never existed', done => {
            expect(testNameManager.removeName("Pierre")).to.be.false;
            done();
        });

    });

});
