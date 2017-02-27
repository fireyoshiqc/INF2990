/**
 * gameController.service.spec.ts
 *
 * @authors Vincent Chassé et Pierre To
 * @date 2017/02/24
 */

import { expect } from 'chai';

import { GameController } from './gameController.service';
import { Team } from '../entities/curlingStone';

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
    });
});
