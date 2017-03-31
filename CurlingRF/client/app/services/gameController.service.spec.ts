/**
 * gameController.service.spec.ts
 *
 * @authors Vincent Chassé et Erica Bugden
 * @date 2017/03/31
 */

import { expect } from 'chai';

import { GameController } from './gameController.service';

describe('GameController', () => {

    let gameController = new GameController();

    describe('getPlayerName()', () => {
        it('should return the player name', done => {
            expect(gameController.getPlayerName()).to.exist;
            done();
        });
    });

    describe('setPlayerName()', () => {
        it('should change the player name', done => {
            let name = "Toast";
            gameController.setPlayerName(name);

            expect(gameController.getPlayerName()).to.equal(name);
            done();
        });
    });

    describe('getGameData()', () => {
        it('should return the game data', done => {
            expect(gameController.getGameData()).to.exist;
            done();
        });
    });

    describe('getHUDData()', () => {
        it('should return the HUD data', done => {
            expect(gameController.getHUDData()).to.exist;
            done();
        });
    });
});
