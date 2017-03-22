/**
 * gameController.service.spec.ts
 *
 * @authors Vincent Chassé et Pierre To
 * @date 2017/02/24
 */

import { expect } from 'chai';

import { GameController, AIDifficulty } from './gameController.service';
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

            expect(gameController.getCurrentState()).to.be.instanceOf(IdleState);
            expect(gameController.getGameRenderer().getIsStarted()).to.be.true;

            done();
        });
    });

    describe('setPlayerName()', () => {
        it('should set the name of the player.', done => {
            gameController.setPlayerName("Nouveau nom joueur");
            expect(gameController.getPlayerName()).to.be.equal("Nouveau nom joueur");
            done();
        });
    });

    describe('setAIDifficulty()', () => {
        it('should set the difficulty of the AI to hard.', done => {
            gameController.setAIDifficulty(AIDifficulty.Hard);
            expect(gameController.getAIDDifficulty()).to.be.equal(AIDifficulty.Hard);
            done();
        });

        it('should set the difficulty of the AI to easy.', done => {
            gameController.setAIDifficulty(AIDifficulty.Easy);
            expect(gameController.getAIDDifficulty()).to.be.equal(AIDifficulty.Easy);
            done();
        });
    });

    describe('startNextRound()', () => {
        it('should start a new round.', done => {
            let rounds = gameController.getRoundsCompleted();
            expect(rounds.findIndex(nextRound => nextRound === true)).to.be.equal(-1);
            gameController.startNextRound();
            expect(rounds.findIndex(nextRound => nextRound === true)).to.be.equal(0);
            expect(gameController.getShowNextRoundMessage()).to.be.false;
            expect(gameController.getStonesThrown()).to.be.equal(0);
            done();
        });
    });

    describe('startNextThrow()', () => {
        it('should start a new throw.', done => {
            gameController.startNextThrow();
            expect(gameController.getShowNextThrowMessage()).to.be.false;
            done();
        });
    });

    describe('chooseNextFirstPlayer()', () => {
        it('should choose the first player of the next round.', done => {
            gameController.setPlayerScore(10);
            gameController.setAiScore(5);
            gameController.chooseNextFirstPlayer();
            expect(gameController.getIsPlayerTurn()).to.be.true;

            gameController.setPlayerScore(5);
            gameController.setAiScore(10);
            gameController.chooseNextFirstPlayer();
            expect(gameController.getIsPlayerTurn()).to.be.false;

            gameController.setPlayerScore(0);
            gameController.setAiScore(0);
            done();
        });
    });

    describe('scoring tests', () => {
        describe('setStonesForScoringTests()', () => {
            it('should add 8 curling stones to the game controller', done => {
                gameController.resetStones();
                gameController.setStonesForScoringTests();

                expect(gameController.getCurlingStones().length).to.be.equal(8);
                expect(gameController.getCurlingStones()[0].getTeam()).to.be.equal(Team.Player);
                expect(gameController.getCurlingStones()[1].getTeam()).to.be.equal(Team.Player);
                expect(gameController.getCurlingStones()[2].getTeam()).to.be.equal(Team.Player);
                expect(gameController.getCurlingStones()[3].getTeam()).to.be.equal(Team.Player);
                expect(gameController.getCurlingStones()[4].getTeam()).to.be.equal(Team.AI);
                expect(gameController.getCurlingStones()[5].getTeam()).to.be.equal(Team.AI);
                expect(gameController.getCurlingStones()[6].getTeam()).to.be.equal(Team.AI);
                expect(gameController.getCurlingStones()[7].getTeam()).to.be.equal(Team.AI);

                done();
            });
        });

        describe('sortStonesByDistance()', () => {
            it('should sort stones by distance to center of the rings.', done => {
                gameController.getGameRenderer().getPhysicsManager().sortStonesByDistance();
                let sortStones = gameController.getCurlingStones();

                expect(sortStones.length).to.be.equal(8);
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
            it('should remove 8 curling stones from game controller', done => {
                gameController.resetStones();

                expect(gameController.getCurlingStones().length).to.be.equal(0);

                done();
            });
        });
    });

    describe('startThrowStone()', () => {
        it('should switch gameController to choosingAngleState with clockwise spin', done => {
            gameController.enterIdleState();
            gameController.startThrowStone("true");
            let index = gameController.getCurlingStones().length - 1;
            expect(gameController.getCurlingStones()[index].getSpinOrientation()).to.be.equal(-1);
            expect(gameController.getCurrentState()).to.be.instanceOf(ChoosingAngleState);
            done();
        });

        it('should switch gameController to choosingAngleState with counterClockwise spin', done => {
            gameController.enterIdleState();
            gameController.startThrowStone("false");
            let index = gameController.getCurlingStones().length - 1;
            expect(gameController.getCurlingStones()[index].getSpinOrientation()).to.be.equal(1);
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

    describe('enterChoosingAngleState()', () => {
        it('should switch gameController to enterChoosingAngleState', done => {
            gameController.enterChoosingAngleState();
            expect(gameController.getCurrentState()).to.be.instanceOf(ChoosingAngleState);
            done();
        });
    });

    describe('removeThrownStoneFromHUD()', () => {
        it('should remove one stone from the active player\'s available curling stones.', done => {
            expect(gameController.getPlayerCurlingStones().length).to.be.equal(8);
            gameController.setIsPlayerTurn(true);
            gameController.removeThrownStoneFromHUD();
            expect(gameController.getPlayerCurlingStones().length).to.be.equal(7);
            gameController.removeThrownStoneFromHUD();
            gameController.removeThrownStoneFromHUD();
            gameController.removeThrownStoneFromHUD();
            gameController.removeThrownStoneFromHUD();
            gameController.removeThrownStoneFromHUD();
            gameController.removeThrownStoneFromHUD();
            gameController.removeThrownStoneFromHUD();
            expect(gameController.getPlayerCurlingStones().length).to.be.equal(0);
            gameController.removeThrownStoneFromHUD();
            expect(gameController.getPlayerCurlingStones().length).to.be.equal(0);

            expect(gameController.getAICurlingStones().length).to.be.equal(8);
            gameController.setIsPlayerTurn(false);
            gameController.removeThrownStoneFromHUD();
            expect(gameController.getAICurlingStones().length).to.be.equal(7);
            gameController.removeThrownStoneFromHUD();
            gameController.removeThrownStoneFromHUD();
            gameController.removeThrownStoneFromHUD();
            gameController.removeThrownStoneFromHUD();
            gameController.removeThrownStoneFromHUD();
            gameController.removeThrownStoneFromHUD();
            gameController.removeThrownStoneFromHUD();
            expect(gameController.getAICurlingStones().length).to.be.equal(0);
            gameController.removeThrownStoneFromHUD();
            expect(gameController.getAICurlingStones().length).to.be.equal(0);
            done();
        });
    });
});
