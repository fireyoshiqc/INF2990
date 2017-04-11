/**
 * PlayerIdleState.spec.ts
 *
 * @authors Pierre To et Yawen Hou
 * @date 2017/04/10
 */

import { PlayerIdleState } from './PlayerIdleState';
import { GameController } from '../gameController.service';

import { expect } from 'chai';

describe('PlayerIdleState', () => {

    let playerIdleState: PlayerIdleState;
    let gameController = new GameController(null, null);

    describe('init() and getInstance()', () => {
        it('should initialize an playerIdleState', done => {
            playerIdleState = PlayerIdleState.getInstance();
            playerIdleState.init(gameController);

            expect(playerIdleState).to.exist;
            expect(playerIdleState).to.be.an.instanceof(PlayerIdleState);

            done();
        });
    });
});
