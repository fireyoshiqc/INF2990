/**
 * cameraManager.service.ts
 *
 * @authors Erica Bugden et Pierre To
 * @date 2017/02/17
 */

import { Injectable } from '@angular/core';

@Injectable()
export class CameraManager {

    private cameraPerspective: THREE.PerspectiveCamera;
    private cameraOrthographic: THREE.OrthographicCamera;
    private currentCamera: THREE.Camera;
    private usingPerspectiveCamera = true; // by default, use perspective camera
    private readonly ORTHO_ZOOM_FACTOR = 80 / 1920; // determined experimentally
    private readonly PERSPECTIVE_OFFSET = 5;
    private readonly PERSPECTIVE_FOV = 45;
    private readonly PERSPECTIVE_NEAR = 1;
    private readonly PERSPECTIVE_FAR = 10000;
    private readonly PERSPECTIVE_Z_POS = 2;
    private readonly PERSPECTIVE_Y_POS = 2;
    private readonly PERSPECTIVE_X_POS = -Math.PI / 18;
    private readonly ORTHO_NEAR = 1;
    private readonly ORTHO_FAR = 10000;
    private readonly ORTHO_Z_POS = -23;
    private readonly ORTHO_Y_POS = 5;
    private readonly ORTHO_X_POS = 0;
    private readonly ORTHO_Z_ROT = Math.PI / 2;
    private readonly ORTHO_X_ROT = -Math.PI / 2;

    constructor(container: HTMLElement) {
        let containerRect = container.getBoundingClientRect();

        this.initPerspectiveCamera(containerRect);
        this.initOrthographicCamera(containerRect);

        // by default, use perspective camera
        this.currentCamera = this.cameraPerspective;
    }

    private initPerspectiveCamera(containerRect: ClientRect) {
        // Camera creation
        let aspectPerspective = containerRect.width / containerRect.height;
        this.cameraPerspective = new THREE.PerspectiveCamera(this.PERSPECTIVE_FOV,
            aspectPerspective, this.PERSPECTIVE_NEAR, this.PERSPECTIVE_FAR);

        // Camera position
        this.cameraPerspective.position.z = this.PERSPECTIVE_Z_POS;
        this.cameraPerspective.position.y = this.PERSPECTIVE_Y_POS;
        this.cameraPerspective.rotation.x = this.PERSPECTIVE_X_POS;
    }

    private initOrthographicCamera(containerRect: ClientRect) {
        // Camera creation
        let zoomFactor = this.ORTHO_ZOOM_FACTOR * containerRect.width;
        let leftPlaneOrthographic = containerRect.width / -zoomFactor;
        let rightPlaneOrthographic = containerRect.width / zoomFactor;
        let topPlaneOrthographic = containerRect.height / (zoomFactor * containerRect.height);
        let bottomPlaneOrthographic = containerRect.height / (-zoomFactor * containerRect.height);
        this.cameraOrthographic = new THREE.OrthographicCamera(leftPlaneOrthographic, rightPlaneOrthographic,
            topPlaneOrthographic, bottomPlaneOrthographic, this.ORTHO_NEAR, this.ORTHO_FAR);

        // Camera position
        this.cameraOrthographic.rotateX(this.ORTHO_X_ROT);
        this.cameraOrthographic.rotateZ(this.ORTHO_Z_ROT);
        this.cameraOrthographic.position.x = this.ORTHO_X_POS;
        this.cameraOrthographic.position.y = this.ORTHO_Y_POS;
        this.cameraOrthographic.position.z = this.ORTHO_Z_POS;
    }

    isUsingPerspectiveCamera(): boolean {
        return this.usingPerspectiveCamera;
    }

    usePerspectiveCamera(container: HTMLElement): void {
        this.usingPerspectiveCamera = true;
        this.currentCamera = this.cameraPerspective;
        this.onResize(container);
    }

    useOrthographicCamera(container: HTMLElement): void {
        this.usingPerspectiveCamera = false;
        this.currentCamera = this.cameraOrthographic;
        this.onResize(container);
    }

    getCamera(): THREE.Camera {
        return this.currentCamera;
    }

    followStone(position: THREE.Vector3): void {
        // only follow stone when using perspective camera
        if (this.usingPerspectiveCamera) {
            this.cameraPerspective.position.z = position.z + this.PERSPECTIVE_OFFSET;
        }
    }

    // when window is resized, change camera aspects
    onResize(container: HTMLElement) {
        let containerRect = container.getBoundingClientRect();

        if (this.usingPerspectiveCamera) {
            this.cameraPerspective.aspect = (containerRect.width / containerRect.height);

            // update current camera aspect
            this.cameraPerspective.updateProjectionMatrix();
        }
        else {
            let zoomFactor = this.ORTHO_ZOOM_FACTOR * containerRect.width;
            this.cameraOrthographic.left = containerRect.width / -zoomFactor;
            this.cameraOrthographic.right = containerRect.width / zoomFactor;
            this.cameraOrthographic.top = containerRect.height / zoomFactor;
            this.cameraOrthographic.bottom = containerRect.height / -zoomFactor;

            // update current camera aspect
            this.cameraOrthographic.updateProjectionMatrix();
        }
    }
}
