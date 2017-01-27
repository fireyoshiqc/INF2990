import { GameRenderer } from './gameRenderer';

import { assert, expect } from 'chai';


describe('GameRenderer', () => {
  let testRenderer: GameRenderer;
  testRenderer = new GameRenderer();

  describe('Default constructor ', () => {
      it('should construct an empty GameRenderer object.', done => {
          testRenderer = new GameRenderer();
          expect(testRenderer instanceof GameRenderer).to.equal(true);
          done();
      });
  });

  describe('init()', () => {

  });


});
