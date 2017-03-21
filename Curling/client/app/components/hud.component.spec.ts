/**
 * hud.component.spec.ts
 *
 * @authors Pierre To, Mikaël Ferland
 * @date 2017/02/28
 */

import { HUDComponent } from './hud.component';

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

    describe('getPlayerScore()', () => {
        it('should set the default score of the player.', done => {
            expect(hudComponent.getPlayerScore()).to.be.equal(0);
            done();
        });
    });

    describe('getAIScore()', () => {
        it('should get the default score of the AI.', done => {
            expect(hudComponent.getAIScore()).to.be.equal(0);
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
            expect(hudComponent.getPlayerCurlingStones().length).to.be.equal(8);
            hudComponent.removePlayerCurlingStone();
            expect(hudComponent.getPlayerCurlingStones().length).to.be.equal(7);
            hudComponent.removePlayerCurlingStone();
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
            expect(hudComponent.getAICurlingStones().length).to.be.equal(8);
            hudComponent.removeAICurlingStone();
            expect(hudComponent.getAICurlingStones().length).to.be.equal(7);
            done();
        });
    });
});
