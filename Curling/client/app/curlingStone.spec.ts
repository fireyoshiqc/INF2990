import { CurlingStone } from './curlingStone';

import { assert, expect } from 'chai';

describe('CurlingStone', () => {

    describe('Default constructor ', () => {
        it('should construct an empty (non-rendered) CurlingStone object.', done => {
          let testStone: CurlingStone;
          testStone = new CurlingStone();
          expect(testStone instanceof CurlingStone).to.equal(true);
          expect(testStone instanceof THREE.Group).to.equal(true);
          done();
        });
        it('should make a white CurlingStone object if no color is entered.', done => {
          let testStone: CurlingStone;
          testStone = new CurlingStone();
          expect(testStone.stoneColor === "#FFFFFF").to.equal(true);
          done();
        });
        it('should make a colored CurlingStone object if a valid color format is entered.', done => {
          let testStone: CurlingStone;
          testStone = new CurlingStone("#FF0000");
          expect(testStone.stoneColor === "#FF0000").to.equal(true);
          done();
        });
        it('should make a white CurlingStone object if an incorrect string is entered.', done => {
          let testStone: CurlingStone;
          testStone = new CurlingStone("DEADBEEF");
          expect(testStone.stoneColor === "DEADBEEF").to.equal(false);
          expect(testStone.stoneColor === "#FFFFFF").to.equal(true);
          done();
        });
    });


});
