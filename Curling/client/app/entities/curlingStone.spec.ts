
import { CurlingStone } from './curlingStone';

import { expect } from 'chai';


describe('CurlingStone', () => {

    let testStone: CurlingStone;
    testStone = new CurlingStone();

    describe('Default constructor ', () => {
        it('should construct an empty (non-rendered) CurlingStone object.', done => {
            testStone = new CurlingStone();
            expect(testStone).to.not.be.undefined;
            expect(testStone).to.be.an.instanceof(CurlingStone);
            expect(testStone).to.be.an.instanceof(THREE.Group);
            done();
        });
        it('should make a white CurlingStone object if no color is entered.', done => {
            testStone = new CurlingStone();
            expect(testStone.stoneColor).to.equal("#FFFFFF");
            done();
        });
        it('should make a colored CurlingStone object if a valid color format is entered.', done => {
            testStone = new CurlingStone("#FF0000");
            expect(testStone.stoneColor).to.equal("#FF0000");
            done();
        });
        it('should make a white CurlingStone object if an incorrect string is entered.', done => {
            testStone = new CurlingStone("DEADBEEF");
            expect(testStone.stoneColor).to.not.equal("DEADBEEF");
            expect(testStone.stoneColor).to.equal("#FFFFFF");
            done();
        });
    });

    describe('init()', () => {
        it('should add a Curling Stone base (mesh) and a cover (mesh) to the group object.', done => {
            testStone.init();
            expect(testStone.children.length).to.equal(2);

            done();
        });

    });


});
