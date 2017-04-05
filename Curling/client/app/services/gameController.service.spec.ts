/**
 * gameController.service.spec.ts
 *
 * @authors Vincent Chassé, Erica Bugden
 * @modified Félix Boulet, Mikaël Ferland
 * @date 2017/04/01
 */

import { GameController } from './gameController.service';

import { expect } from 'chai';

describe('GameController', () => {

    let gameController = new GameController();

    describe('getMaxThrows()', () => {
        it('return the max amount of throws for the curling game.', done => {
            expect(gameController.getMaxThrows()).to.eql(16, "There are 16 stones to throw in one round.");
            done();
        });
    });

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

    describe('getAIDifficulty()', () => {
        it('should return 0 at the beginning', done => {
            expect(gameController.getAIDifficulty()).to.equal(0);
            done();
        });
    });

    describe('setAIDifficulty()', () => {
        it('should change the aiDifficulty', done => {
            gameController.setAIDifficulty("Ordi normal");
            expect(gameController.getAIDifficulty()).to.equal(1);
            gameController.setAIDifficulty("Ordi difficile");
            expect(gameController.getAIDifficulty()).to.equal(2);
            done();
        });
    });

    describe('resetAIDifficulty()', () => {
        it('should reset the aiDifficulty to undefined (0)', done => {
            gameController.resetAIDifficulty();
            expect(gameController.getAIDifficulty()).to.equal(0);
            done();
        });
    });

    describe('getGameData()', () => {
        it('should return the game data', done => {
            const gameData = gameController.getGameData();
            expect(gameData).to.exist;
            expect(gameData.aiScore).to.eql(0, "AI has no score at beginning of the game.");
            expect(gameData.curveAngle).to.eql(0, "Curve has no angle before the ChoosingAngleState.");
            expect(gameData.forceValue).to.eql(0, "Force is zero before the ShootingState.");
            expect(gameData.isPlayerTurn).to.eql(false, "Default first player is the AI.");
            expect(gameData.playerScore).to.eql(0, "Player has no score at beginning of the game.");
            expect(gameData.roundsCompleted).to.eql([false, false, false],
                "No rounds are completed at beginning of the game.");
            expect(gameData.spinClockwise).to.eql(false, "Default stone spin is anti-clockwise.");
            expect(gameData.state).to.be.null;
            done();
        });
    });

    describe('getHUDData()', () => {
        it('should return the HUD data', done => {
            const hudData = gameController.getHUDData();
            expect(hudData).to.exist;
            expect(hudData.aiStones.length).to.eql(8, "AI has 8 stones at beginning of the game.");
            expect(hudData.forceVisible).to.eql(false, "Force bar is not displayed before the ShootingState.");
            expect(hudData.nextRoundMessageVisible).to.eql(false,
                "Next round message is not visible before the end of the round.");
            expect(hudData.nextThrowMessageVisible).to.eql(false,
            "Next throw message is not visible before the EndThrowState.");
            expect(hudData.playerStones.length).to.eql(8, "Player has 8 stones at beginning of the game.");
            expect(hudData.sliderDisabled).to.eql(false, "Spin selector (slider) is enabled at the beginning.");
            done();
        });
    });
});
