/**
 * sceneBuilder.service.spec.ts
 *
 * @authors Vincent Chassé, Erica Bugden
 * @modified Félix Boulet, Mikaël Ferland
 * @date 2017/04/01
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

    describe('buildScene()', () => {
        it('should build a scene with a rink, skybox and lighting.', done => {
            sceneBuilder.buildScene().then((scene) => {
                expect(scene).to.exist;
                expect(scene.getObjectByName("rink")).to.exist;
                expect(scene.getObjectByName("skybox")).to.exist;
                expect(scene.getObjectByName("lighting")).to.exist;
                done();
            });
        });
    });

    describe('buildAngleCurve()', () => {
        it('should build a dashed, directional shooting line.', done => {
            sceneBuilder.buildAngleCurve().then((curve) => {
                expect(curve).to.exist;
                expect((<THREE.LineDashedMaterial>curve.material).color.getHex())
                    .to.eql(0xFF0000, "Curve has to be red.");
                done();
            });
        });
    });

    describe('getRinkData()', () => {
        it('should return the rink data interface.', done => {
            const rinkData = sceneBuilder.getRinkData();
            expect(rinkData).to.exist;
            expect(rinkData.dims.width).to.eql(4.4, "Rink has a width of 4.4 meters.");
            expect(rinkData.dims.length).to.eql(46, "Rink has a length of 46 meters.");
            expect(rinkData.dims.height).to.eql(0.1, "Rink has a height of 0.1 meters.");
            expect(rinkData.lines.start).to.eql(-21.1 + 23, "Start line is at 1.9 meters.");
            expect(rinkData.lines.hog).to.eql(11.72 + 23, "Hog line is at 34.72 meters.");
            expect(rinkData.lines.back).to.eql(19.2 + 23, "Back line is at 42.2 meters.");
            expect(rinkData.rings.center).to.eql(0.15, "Ring center has a radius of 0.15 meters.");
            expect(rinkData.rings.inner).to.eql(0.6, "Red ring has a radius of 0.6 meters.");
            expect(rinkData.rings.middle).to.eql(1.2, "White ring has a radius of 1.2 meters.");
            expect(rinkData.rings.outer).to.eql(1.8, "Blue ring has a radius of 1.8 meters.");
            expect(rinkData.rings.offset).to.eql(17.37 + 23, "Rings are at 40.37 meters.");
            done();
        });
    });

    describe('getCurveData()', () => {
        it('should return the curve data.', done => {
            const curveData = sceneBuilder.getCurveData();
            expect(curveData).to.exist;
            expect(curveData.dashSize).to.eql(0.1, "Curve has dashes of size 0.1 meters.");
            expect(curveData.gapSize).to.eql(0.1, "Curve has gaps of size 0.1 meters.");
            expect(curveData.translateOffset).to.eql(0.5, "Curve is offset by 0.5 meters on spawn.");
            expect(curveData.maxAngle).to.eql(30, "Curve has a max angle of 30 degrees.");
            done();
        });
    });
});
