/**
 * SweepingState.spec.ts
 *
 * @authors Pierre To et Yawen Hou
 * @date 2017/04/10
 */

import { SweepingState } from './SweepingState';
import { GameController } from '../gameController.service';

import { expect } from 'chai';

describe('SweepingState', () => {

    let sweepingState: SweepingState;
    let gameController = new GameController(null, null);

    describe('init() and getInstance()', () => {
        it('should initialize an sweepingState', done => {
            sweepingState = SweepingState.getInstance();
            sweepingState.init(gameController);

            expect(sweepingState).to.exist;
            expect(sweepingState).to.be.an.instanceof(SweepingState);

            done();
        });
    });
});
