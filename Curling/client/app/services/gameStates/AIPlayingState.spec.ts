/**
 * AIPlayingState.spec.ts
 *
 * @authors Pierre To et Yawen Hou
 * @date 2017/04/10
 */

import { AIPlayingState, getRandomFloat } from './AIPlayingState';
import { GameController } from '../gameController.service';

import { expect } from 'chai';

describe('AIPlayingState', () => {

    let aiPlayingState: AIPlayingState;
    let gameController = new GameController(null, null);

    describe('init() and getInstance()', () => {
        it('should initialize an aiPlayingState', done => {
            aiPlayingState = AIPlayingState.getInstance();
            aiPlayingState.init(gameController);

            expect(aiPlayingState).to.exist;
            expect(aiPlayingState).to.be.an.instanceof(AIPlayingState);

            done();
        });
    });

    describe('getRandomFloat() ', () => {
        it('should generate a float between two values', done => {
            let min = -23.4, max = 4.56;
            let random = getRandomFloat(min, max);

            expect(random).to.be.at.least(min).and.at.most(max);
            done();
        });
    });
});
