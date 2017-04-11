/**
 * ChoosingAngleState.spec.ts
 *
 * @authors Pierre To et Yawen Hou
 * @date 2017/04/10
 */

import { ChoosingAngleState } from './ChoosingAngleState';
import { GameController } from '../gameController.service';

import { expect } from 'chai';

describe('ChoosingAngleState', () => {

    let choosingAngleState: ChoosingAngleState;
    let gameController = new GameController(null, null);

    describe('init() and getInstance()', () => {
        it('should initialize an choosingAngleState', done => {
            choosingAngleState = ChoosingAngleState.getInstance();
            choosingAngleState.init(gameController);

            expect(choosingAngleState).to.exist;
            expect(choosingAngleState).to.be.an.instanceof(ChoosingAngleState);

            done();
        });
    });
});
