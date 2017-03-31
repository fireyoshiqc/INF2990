/**
 * sceneBuilder.service.spec.ts
 *
 * @authors Vincent Chassé et Erica Bugden
 * @date 2017/03/31
 */

import { expect } from 'chai';

import { SceneBuilder } from './sceneBuilder.service';

describe('SceneBuilder', () => {

    let sceneBuilder = SceneBuilder.getInstance();

    describe('getInstance()', () => {
        it('should return an instance of SceneBuilder', done => {
            expect(sceneBuilder).to.exist;
            expect(sceneBuilder).instanceOf(SceneBuilder);
            done();
        });
    });

    describe('getCurveData()', () => {
        it('should return the curve data', done => {
            expect(sceneBuilder.getCurveData()).to.exist;
            done();
        });
    });
});
