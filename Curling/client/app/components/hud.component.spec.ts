/**
 * hud.component.spec.ts
 *
 * @authors Pierre To, Mikaël Ferland
 * @date 2017/02/28
 */

import { HUDComponent, AIDifficulty } from './hud.component';

import { expect } from 'chai';

describe('HUDComponent', () => {

    let hudComponent = new HUDComponent();

    describe('Default constructor ', () => {
        it('should construct the HUDComponent.', done => {
            expect(hudComponent).to.not.be.undefined;
            expect(hudComponent).to.be.an.instanceof(HUDComponent);
            done();
        });
    });

    describe('toggleTheme()', () => {
        it('should toggle the theme.', done => {
            expect(hudComponent.getTheme()).to.be.false;
            hudComponent.toggleTheme();
            expect(hudComponent.getTheme()).to.be.true;
            done();
        });
    });

    describe('setPlayerName()', () => {
        it('should set the name of the player.', done => {
            expect(hudComponent.getPlayerName()).to.be.equal("Nom joueur");
            hudComponent.setPlayerName("Nouveau nom joueur");
            expect(hudComponent.getPlayerName()).to.be.equal("Nouveau nom joueur");
            done();
        });
    });

    describe('setAIDifficulty()', () => {
        it('should set the difficulty of the AI to hard.', done => {
            expect(hudComponent.getAIDDifficulty()).to.be.equal(AIDifficulty.Easy);
            hudComponent.setAIDifficulty(AIDifficulty.Hard);
            expect(hudComponent.getAIDDifficulty()).to.be.equal(AIDifficulty.Hard);
            done();
        });

        it('should set the difficulty of the AI to easy.', done => {
            hudComponent.setAIDifficulty(AIDifficulty.Easy);
            expect(hudComponent.getAIDDifficulty()).to.be.equal(AIDifficulty.Easy);
            done();
        });
    });

    describe('setPlayerScore()', () => {
        it('should set the score of the player.', done => {
            expect(hudComponent.getPlayerScore()).to.be.equal(0);
            hudComponent.setPlayerScore(3);
            expect(hudComponent.getPlayerScore()).to.be.equal(3);
            done();
        });
    });

    describe('setAIScore()', () => {
        it('should set the score of the AI.', done => {
            expect(hudComponent.getAIScore()).to.be.equal(0);
            hudComponent.setAIScore(5);
            expect(hudComponent.getAIScore()).to.be.equal(5);
            done();
        });
    });

    describe('startNextRound()', () => {
        it('should start a new round.', done => {
            let rounds = hudComponent.getRounds();
            expect(rounds.findIndex(nextRound => nextRound === true)).to.be.equal(-1);
            hudComponent.startNextRound();
            expect(rounds.findIndex(nextRound => nextRound === true)).to.be.equal(0);
            done();
        });
    });

    describe('removePlayerCurlingStone()', () => {
        it('should remove one stone from the player\'s available curling stones.', done => {
            expect(hudComponent.getPlayerCurlingStones().length).to.be.equal(7);
            hudComponent.removePlayerCurlingStone();
            expect(hudComponent.getPlayerCurlingStones().length).to.be.equal(6);
            hudComponent.removePlayerCurlingStone();
            hudComponent.removePlayerCurlingStone();
            hudComponent.removePlayerCurlingStone();
            hudComponent.removePlayerCurlingStone();
            hudComponent.removePlayerCurlingStone();
            hudComponent.removePlayerCurlingStone();
            expect(hudComponent.getPlayerCurlingStones().length).to.be.equal(0);
            hudComponent.removePlayerCurlingStone();
            expect(hudComponent.getPlayerCurlingStones().length).to.be.equal(0);
            done();
        });
    });

    describe('removeAICurlingStone()', () => {
        it('should remove one stone from the AI\'s available curling stones.', done => {
            expect(hudComponent.getAICurlingStones().length).to.be.equal(7);
            hudComponent.removeAICurlingStone();
            expect(hudComponent.getAICurlingStones().length).to.be.equal(6);
            done();
        });
    });
});
