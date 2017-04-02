/**
 * playerHandler.module.spec.ts
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/04/02
 */

import { PlayerHandler } from './playerHandler.module';
import { Player } from '../classes/player';

import { expect } from 'chai';

describe('PlayerHandler', () => {

    describe('requestPlayer', () => {
        let activePlayer = PlayerHandler.requestPlayer();

        it('should return a player.', done => {
            expect(PlayerHandler).to.exist;
            expect(activePlayer).to.exist;
            expect(activePlayer).to.be.an.instanceOf(Player);
            done();
        });

        it('should return the same active player.', done => {
            activePlayer.setName("Test");
            let testActivePlayer = PlayerHandler.requestPlayer();

            expect(activePlayer.getName()).to.be.equal(testActivePlayer.getName());
            done();
        });
    });
});
