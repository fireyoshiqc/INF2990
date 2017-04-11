/**
 * EndThrowState.spec.ts
 *
 * @authors Pierre To et Yawen Hou
 * @date 2017/04/10
 */

import { EndThrowState } from './EndThrowState';
import { GameController } from '../gameController.service';

import { expect } from 'chai';

describe('EndThrowState', () => {

    let endThrowState: EndThrowState;
    let gameController = new GameController(null, null);

    describe('init() and getInstance()', () => {
        it('should initialize an endThrowState', done => {
            endThrowState = EndThrowState.getInstance();
            endThrowState.init(gameController);

            expect(endThrowState).to.exist;
            expect(endThrowState).to.be.an.instanceof(EndThrowState);

            done();
        });
    });
});
