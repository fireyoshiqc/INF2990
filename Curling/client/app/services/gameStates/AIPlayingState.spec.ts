/**
 * AIPlayingState.spec.ts
 *
 * @authors Pierre To et Yawen Hou
 * @date 2017/04/10
 */

import { AIPlayingState, getRandomFloat } from './AIPlayingState';
import { GameController } from '../gameController.service';
import { CurlingStone, Team } from '../../entities/curlingStone';

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

    describe('getSpinAndFinalPosition()', () => {
        it('should return the finalPosition according to the initial aiming position', done => {
            let testStone = new CurlingStone(Team.AI);
            let initialAimingPosition = new THREE.Vector3(-1, 0, 40);
            let finalAimingPosition = initialAimingPosition.clone();
            // The aimingPosition is on the right side, so aim a little on the left
            finalAimingPosition.x += CurlingStone.MAX_DIAMETER;

            expect(aiPlayingState.getSpinAndFinalPosition(initialAimingPosition, testStone))
                .to.eql(finalAimingPosition);
            done();
        });

        it('should return the finalPosition according to the initial aiming position', done => {
            let testStone = new CurlingStone(Team.AI);
            let initialAimingPosition = new THREE.Vector3(1, 0, 40);
            let finalAimingPosition = initialAimingPosition.clone();
            // The aimingPosition is on the left side, so aim a little on the right to push the stone outside
            finalAimingPosition.x -= CurlingStone.MAX_DIAMETER;

            expect(aiPlayingState.getSpinAndFinalPosition(initialAimingPosition, testStone))
                .to.eql(finalAimingPosition);
            done();
        });
    });
});
