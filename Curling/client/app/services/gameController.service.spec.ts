/**
 * gameController.service.spec.ts
 *
 * @authors Vincent Chassé et Pierre To
 * @date 2017/02/24
 */

import { expect } from 'chai';

import { GameController } from './gameController.service';

describe('GameController', () => {

    let gameController = new GameController();

    describe('constructor()', () => {
        it('should construct a GameController', done => {
            expect(gameController).to.exist;
            expect(gameController).to.be.an.instanceOf(GameController);
            done();
        });
    });

    describe('init()', () => {
        it('should start the game renderer without a provided HTMLElement (that cannot be tested).', done => {
            gameController.init();
            expect(gameController.getCurlingStones()).to.not.be.empty;
            done();
        });
    });
});
