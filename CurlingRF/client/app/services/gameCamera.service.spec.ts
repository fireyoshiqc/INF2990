/**
 * cameraManager.service.spec.ts
 *
 * @authors Félix Boulet
 * @modified Félix Boulet, Mikaël Ferland
 * @date 2017/04/01
 */

import { GameCamera } from './gameCamera.service';
import { expect } from 'chai';

describe('CameraManager', () => {

    let camera = GameCamera.getInstance();
    camera.init(document.body);

    describe('constructor()', () => {
        it('should construct a CameraManager using a given HTML container.', done => {
            expect(camera).to.exist;
            done();
        });
        it('should make the camera use perspective mode by default.', done => {
            expect(camera.isUsingPerspectiveCamera()).to.be.true;
            done();
        });
    });

    describe('isUsingPerspectiveCamera()', () => {
        it('should return a boolean.', done => {
            expect(camera.isUsingPerspectiveCamera()).to.exist;
            done();
        });
    });

    describe('useOrthographicCamera()', () => {

        camera.useOrthographicCamera(document.body);
        let perspective = camera.isUsingPerspectiveCamera();

        it('should change the camera to an orthographic one.', done => {
            expect(perspective).to.be.false;
            done();
        });
    });

    describe('usePerspectiveCamera()', () => {

        camera.usePerspectiveCamera(document.body);
        let perspective = camera.isUsingPerspectiveCamera();

        it('should change the camera to a perspective one.', done => {
            expect(perspective).to.be.true;
            done();
        });
    });

    describe('getCamera()', () => {
        it('should return a THREE.js camera.', done => {
            expect(camera.getCamera()).to.be.an.instanceof(THREE.Camera);
            done();
        });
    });

    describe('followStone()', () => {
        it('should follow a given stone position.', done => {
            const dummyVector = new THREE.Vector3(0, 0, 0);
            camera.followStone(dummyVector);
            expect(camera.getCamera().position.x).to.eql(0, "Camera is always centered in X.");
            expect(camera.getCamera().position.y).to.be.above(0, "Camera is always above the stone and the ice.");
            expect(camera.getCamera().position.z).to.be.below(0, "Camera is always behind the stone.");
            done();
        });
    });
});
