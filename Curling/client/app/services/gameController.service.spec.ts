/**
 * gameController.service.spec.ts
 *
 * @authors Vincent Chassé et Pierre To
 * @date 2017/02/24
 */

import { expect } from 'chai';

import { GameController } from './gameController.service';
import { Team } from '../entities/curlingStone';
import { ShootingState } from './gameStates/ShootingState';
import { IdleState } from './gameStates/IdleState';
import { ChoosingAngleState } from './gameStates/ChoosingAngleState';
import { SweepingState } from './gameStates/SweepingState';

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
        it('should start the game controller with a game renderer', done => {
            gameController.init();

            expect(gameController.getCurlingStones().length).to.be.equal(1);
            expect(gameController.getCurlingStones()[0].getTeam()).to.be.equal(Team.Player);
            expect(gameController.getCurrentState()).to.be.instanceOf(IdleState);
            expect(gameController.getGameRenderer().isStarted).to.be.true;

            done();
        });
    });

    describe('scoring tests', () => {
        describe('setStonesForScoringTests()', () => {
            it('should add 8 curling stones to the game controller', done => {
                gameController.setStonesForScoringTests();

                expect(gameController.getCurlingStones().length).to.be.equal(9);
                expect(gameController.getCurlingStones()[1].getTeam()).to.be.equal(Team.Player);
                expect(gameController.getCurlingStones()[2].getTeam()).to.be.equal(Team.Player);
                expect(gameController.getCurlingStones()[3].getTeam()).to.be.equal(Team.Player);
                expect(gameController.getCurlingStones()[4].getTeam()).to.be.equal(Team.Player);
                expect(gameController.getCurlingStones()[5].getTeam()).to.be.equal(Team.AI);
                expect(gameController.getCurlingStones()[6].getTeam()).to.be.equal(Team.AI);
                expect(gameController.getCurlingStones()[7].getTeam()).to.be.equal(Team.AI);
                expect(gameController.getCurlingStones()[8].getTeam()).to.be.equal(Team.AI);

                done();
            });
        });

        describe('sortStonesByDistance()', () => {
            it('should sort stones by distance to center of the rings.', done => {
                let sortStones = gameController.sortStonesByDistance();

                expect(sortStones.length).to.be.equal(9);
                expect(sortStones[0].getTeam()).to.be.equal(Team.AI);
                expect(sortStones[1].getTeam()).to.be.equal(Team.AI);
                expect(sortStones[2].getTeam()).to.be.equal(Team.Player);
                expect(sortStones[3].getTeam()).to.be.equal(Team.AI);
                expect(sortStones[4].getTeam()).to.be.equal(Team.Player);
                expect(sortStones[5].getTeam()).to.be.equal(Team.Player);
                expect(sortStones[6].getTeam()).to.be.equal(Team.Player);
                expect(sortStones[7].getTeam()).to.be.equal(Team.AI);

                done();
            });
        });

        describe('updateScore()', () => {
            it('should increment ai score by 2', done => {
                gameController.updateScore();

                expect(gameController.getAiScore()).to.be.equal(2);
                expect(gameController.getPlayerScore()).to.be.equal(0);

                done();
            });
        });

        describe('resetStones()', () => {
            it('should remove 8 curling stones form game controller', done => {
                gameController.resetStones();

                expect(gameController.getCurlingStones().length).to.be.equal(1);

                done();
            });
        });

        describe('startThrowStone()', () => {
            it('should switch gameController to choosingAngleState with clockwise spin', done => {
                gameController.startThrowStone("true");
                expect(gameController.getCurlingStones()[0].getSpinOrientation()).to.be.equal(-1);
                expect(gameController.getCurrentState()).to.be.instanceOf(ChoosingAngleState);
                done();
            });

            it('should switch gameController to choosingAngleState with counterClockwise spin', done => {
                gameController.enterIdleState();
                gameController.startThrowStone("false");
                expect(gameController.getCurlingStones()[0].getSpinOrientation()).to.be.equal(1);
                expect(gameController.getCurrentState()).to.be.instanceOf(ChoosingAngleState);
                done();
            });
        });

        describe('enterShootingState()', () => {
            it('should switch gameController to shootingState with the force bar visible', done => {
                gameController.enterShootingState();
                expect(gameController.isForceVisible()).to.be.true;
                expect(gameController.getCurrentState()).to.be.instanceOf(ShootingState);
                done();
            });
        });

        describe('enterSweepingState()', () => {
            it('should switch gameController to sweepingState with the force bar visible', done => {
                gameController.enterSweepingState();
                expect(gameController.getCurrentState()).to.be.instanceOf(SweepingState);
                done();
            });
        });

         describe('enterIdleState()', () => {
            it('should switch gameController to idleState with the force bar visible', done => {
                gameController.enterIdleState();
                expect(gameController.getCurrentState()).to.be.instanceOf(IdleState);
                done();
            });
        });
    });
});
