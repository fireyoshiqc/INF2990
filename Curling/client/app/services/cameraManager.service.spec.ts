/**
 * cameraManager.service.spec.ts
 *
 * @authors Félix Boulet
 * @date 2017/02/18
 */
import { CameraManager } from './cameraManager.service';
import { expect } from 'chai';

describe('CameraManager', () => {

    let camera = new CameraManager(document.body);

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
        it('should make the camera point towards the observed vector plus an offset.', done => {
            camera.followStone(new THREE.Vector3(0, 0, 0));
            expect(camera.getCamera().position.z).to.equal(2);
            done();
        });
    });
});
