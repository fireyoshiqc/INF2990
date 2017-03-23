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
import { EndThrowState } from './gameStates/EndThrowState';

describe('GameController', () => {
    let gameController = new GameController();

    describe('constructor() and getters', () => {
        it('should construct a GameController', done => {
            expect(gameController).to.exist;
            expect(gameController).to.be.an.instanceOf(GameController);
            expect(gameController.getPlayerName()).to.be.equal("");
            expect(gameController.getAIDDifficulty()).to.be.equal(AIDifficulty.Easy);
            expect(gameController.getPlayerScore()).to.be.equal(0);
            expect(gameController.getAiScore()).to.be.equal(0);
            expect(gameController.getPlayerCurlingStones().length).to.be.equal(8);
            expect(gameController.getAICurlingStones().length).to.be.equal(8);
            expect(gameController.getGameRenderer()).to.be.undefined;
            expect(gameController.getCurlingStones().length).to.be.equal(0);
            expect(gameController.getCurrentState()).to.be.an.instanceOf(IdleState);
            expect(gameController.getShootingAngle()).to.be.undefined;
            expect(gameController.isForceVisible()).to.be.false;
            expect(gameController.getIsPlayerTurn()).to.be.false;
            expect(gameController.getStonesThrown()).to.be.equal(0);
            expect(gameController.getRoundsCompleted()[0]).to.be.false;
            expect(gameController.getShowNextThrowMessage()).to.be.false;
            expect(gameController.getShowNextRoundMessage()).to.be.false;
            expect(gameController.getShowNextThrowMessage()).to.be.false;
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

    describe('addStone()', () => {
        it('should add a stone to the game.', done => {
            expect(gameController.getCurlingStones().length).to.be.equal(0);
            gameController.addStone(Team.Player, new THREE.Vector3(0, 0, 0));
            expect(gameController.getCurlingStones().length).to.be.equal(1);
            expect(gameController.getCurlingStones()[0].getTeam()).to.be.equal(Team.Player);
            gameController.resetStones();
            expect(gameController.getCurlingStones().length).to.be.equal(0);
            done();
        });
    });

    describe('setPlayerScore()', () => {
        it('should set the player score.', done => {
            expect(gameController.getPlayerScore()).to.be.equal(0);
            gameController.setPlayerScore(22);
            expect(gameController.getPlayerScore()).to.be.equal(22);
            gameController.setPlayerScore(0);
            expect(gameController.getPlayerScore()).to.be.equal(0);
            done();
        });
    });

    describe('setAiScore()', () => {
        it('should set the ai score.', done => {
            expect(gameController.getAiScore()).to.be.equal(0);
            gameController.setAiScore(23);
            expect(gameController.getAiScore()).to.be.equal(23);
            gameController.setAiScore(0);
            expect(gameController.getAiScore()).to.be.equal(0);
            done();
        });
    });

    describe('setForceValue()', () => {
        it('should set the force value.', done => {
            expect(gameController.getForceValue()).to.be.equal(0);
            gameController.setForceValue(24);
            expect(gameController.getForceValue()).to.be.equal(24);
            gameController.setForceValue(0);
            expect(gameController.getForceValue()).to.be.equal(0);
            done();
        });
    });

    describe('setIsPlayerTurn()', () => {
        it('should set the player true.', done => {
            gameController.setIsPlayerTurn(true);
            expect(gameController.getIsPlayerTurn()).to.be.true;
            gameController.setIsPlayerTurn(false);
            expect(gameController.getIsPlayerTurn()).to.be.false;
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

    describe('endGame()', () => {
        it('should end the game.', done => {
            gameController.endGame();
            expect(gameController.getShowEndGameMessage()).to.be.true;
            expect(gameController.getCurlingStones().length).to.be.equal(0);
            expect(gameController.getCurrentState()).to.be.an.instanceOf(IdleState);
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

    describe('enterEndThrowState()', () => {
        it('should switch gameController to enterEndThrowState with the show next throw message visible', done => {
            let gc = new GameController();
            gc.init();

            expect(gc.getRoundsCompleted()).to.eql([false, false, false]);
            expect(gc.getShowNextThrowMessage()).to.be.false;

            // First throw
            gc.enterEndThrowState();
            expect(gc.getCurrentState()).to.be.instanceOf(EndThrowState);
            expect(gc.getStonesThrown()).to.be.equal(1);
            expect(gc.getShowNextThrowMessage()).to.be.true;

            // First round
            for (let i = 0; i < 15; i++) {
                gc.enterEndThrowState();
            }
            expect(gc.getStonesThrown()).to.be.equal(16);
            expect(gc.getCurrentState()).to.be.instanceOf(EndThrowState);
            expect(gc.getShowNextRoundMessage()).to.be.true;

            gc.startNextRound();

            expect(gc.getRoundsCompleted()).to.eql([true, false, false]);
            expect(gc.getCurrentState()).to.be.instanceOf(IdleState);
            expect(gc.getStonesThrown()).to.be.equal(0);
            expect(gc.getShowNextRoundMessage()).to.be.false;

            // Second round
            for (let i = 0; i < 16; i++) {
                gc.enterEndThrowState();
            }
            gc.startNextRound();

            expect(gc.getRoundsCompleted()).to.eql([true, true, false]);

            // Third (last) round
            for (let i = 0; i < 16; i++) {
                gc.enterEndThrowState();
            }

            expect(gc.getRoundsCompleted()).to.eql([true, true, true]);
            expect(gc.getCurrentState()).to.be.instanceOf(IdleState);
            expect(gc.getStonesThrown()).to.be.equal(16);
            expect(gc.getShowEndGameMessage()).to.be.true;

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
