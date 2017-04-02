/**
 * sceneBuilder.service.spec.ts
 *
 * @authors Vincent Chassé et Erica Bugden
 * @date 2017/03/31
 */

import { GameEngine } from './gameEngine.service';

import { expect } from 'chai';

describe('GameEngine', () => {

    let gameEngine = GameEngine.getInstance();

    describe('getInstance()', () => {
        it('should return an instance of GameEngine', done => {
            expect(gameEngine).to.exist;
            expect(gameEngine).instanceOf(GameEngine);
            done();
        });
    });

    describe('getStones()', () => {
        it('should return an array of curling stones', done => {
            expect(gameEngine.getStones()).to.exist;
            done();
        });
    });
});
