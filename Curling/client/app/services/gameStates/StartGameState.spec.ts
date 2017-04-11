/**
 * StartGameState.spec.ts
 *
 * @authors Pierre To et Yawen Hou
 * @date 2017/04/10
 */

import { StartGameState } from './StartGameState';
import { GameController } from '../gameController.service';

import { expect } from 'chai';

describe('StartGameState', () => {

    let startGameState: StartGameState;
    let gameController = new GameController(null, null);

    describe('init() and getInstance()', () => {
        it('should initialize an startGameState', done => {
            startGameState = StartGameState.getInstance();
            startGameState.init(gameController);

            expect(startGameState).to.exist;
            expect(startGameState).to.be.an.instanceof(StartGameState);

            done();
        });
    });
});
