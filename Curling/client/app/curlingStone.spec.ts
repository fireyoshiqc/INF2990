import { CurlingStone } from './curlingStone';

import { assert, expect } from 'chai';


describe('CurlingStone', () => {

    let testStone: CurlingStone;
    testStone = new CurlingStone();

    describe('Default constructor ', () => {
        it('should construct an empty (non-rendered) CurlingStone object.', done => {
            testStone = new CurlingStone();
            expect(testStone instanceof CurlingStone).to.equal(true);
            expect(testStone instanceof THREE.Group).to.equal(true);
            done();
        });
        it('should make a white CurlingStone object if no color is entered.', done => {
            testStone = new CurlingStone();
            expect(testStone.stoneColor === "#FFFFFF").to.equal(true);
            done();
        });
        it('should make a colored CurlingStone object if a valid color format is entered.', done => {
            testStone = new CurlingStone("#FF0000");
            expect(testStone.stoneColor === "#FF0000").to.equal(true);
            done();
        });
        it('should make a white CurlingStone object if an incorrect string is entered.', done => {
            testStone = new CurlingStone("DEADBEEF");
            expect(testStone.stoneColor === "DEADBEEF").to.equal(false);
            expect(testStone.stoneColor === "#FFFFFF").to.equal(true);
            done();
        });
    });

    describe('init()', () => {
        it('should add a Curling Stone base (mesh) and a cover (mesh) to the group object', done => {
            testStone.init();
            expect(testStone.children.length === 2).to.equal(true);
            done();
        });

    });


});
