/**
 * ShootingState.spec.ts
 *
 * @authors Pierre To et Yawen Hou
 * @date 2017/04/10
 */

import { ShootingState } from './ShootingState';
import { GameController } from '../gameController.service';

import { expect } from 'chai';

describe('ShootingState', () => {

    let shootingState: ShootingState;
    let gameController = new GameController(null, null);

    describe('init() and getInstance()', () => {
        it('should initialize an shootingState', done => {
            shootingState = ShootingState.getInstance();
            shootingState.init(gameController);

            expect(shootingState).to.exist;
            expect(shootingState).to.be.an.instanceof(ShootingState);

            done();
        });
    });
});
