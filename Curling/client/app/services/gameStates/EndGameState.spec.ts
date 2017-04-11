/**
 * EndGameState.spec.ts
 *
 * @authors Pierre To et Yawen Hou
 * @date 2017/04/10
 */

import { EndGameState } from './EndGameState';
import { GameController } from '../gameController.service';

import { expect } from 'chai';

describe('EndGameState', () => {

    let endGameState: EndGameState;
    let gameController = new GameController(null, null);

    describe('init() and getInstance()', () => {
        it('should initialize an endGameState', done => {
            endGameState = EndGameState.getInstance();
            endGameState.init(gameController);

            expect(endGameState).to.exist;
            expect(endGameState).to.be.an.instanceof(EndGameState);

            done();
        });
    });
});
