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
    private currentCamera : THREE.Camera;
    private usingPerspectiveCamera = true; // by default, use perspective camera
    private readonly cameraOrthographicZoomFactor = 65 / (1440 * 715); // determined experimentally

    constructor(container: HTMLElement) {
        let containerRect = container.getBoundingClientRect();

        this.initPerspectiveCamera(containerRect);
        this.initOrthographicCamera(containerRect);

        // by default, use perspective camera
        this.currentCamera = this.cameraPerspective;
    }

    private initPerspectiveCamera(containerRect: ClientRect) {
        // Camera creation
        let fovPerspectiveDeg = 45;
        let aspectPerspective = containerRect.width / containerRect.height;
        let nearPlanePerspective = 1;
        let farPlanePerspective = 10000;
        this.cameraPerspective = new THREE.PerspectiveCamera(fovPerspectiveDeg,
            aspectPerspective, nearPlanePerspective, farPlanePerspective);

        // Camera position    
        let positionZ = 2;
        let positionY = 2;
        let rotationX = -Math.PI / 18;
        this.cameraPerspective.position.z = positionZ;
        this.cameraPerspective.position.y = positionY;
        this.cameraPerspective.rotation.x = rotationX;
    }

    private initOrthographicCamera(containerRect: ClientRect) {
        // Camera creation
        let zoomFactor = this.cameraOrthographicZoomFactor * containerRect.width * containerRect.height;
        let leftPlaneOrthographic = containerRect.width / -zoomFactor;
        let rightPlaneOrthographic = containerRect.width / zoomFactor;
        let topPlaneOrthographic = containerRect.height / zoomFactor;
        let bottomPlaneOrthographic = containerRect.height / -zoomFactor;
        let nearPlaneOrthographic = 1;
        let farPlaneOrthographic = 10000;
        this.cameraOrthographic = new THREE.OrthographicCamera(leftPlaneOrthographic, rightPlaneOrthographic,
            topPlaneOrthographic, bottomPlaneOrthographic, nearPlaneOrthographic, farPlaneOrthographic);

        // Camera position
        this.cameraOrthographic.rotateX(-Math.PI / 2);
        this.cameraOrthographic.rotateZ(Math.PI / 2);
        let positionCameraOrthographic : THREE.Vector3 = new THREE.Vector3(0, 5, -21);
        this.cameraOrthographic.position.x = positionCameraOrthographic.x;
        this.cameraOrthographic.position.y = positionCameraOrthographic.y;
        this.cameraOrthographic.position.z = positionCameraOrthographic.z;
    }

    isUsingPerspectiveCamera() : boolean {
        return this.usingPerspectiveCamera;
    }

    usePerspectiveCamera(container : HTMLElement) : void {
        this.usingPerspectiveCamera = true;
        this.currentCamera = this.cameraPerspective;
        this.onResize(container);
    }

    useOrthographicCamera(container : HTMLElement) : void {
        this.usingPerspectiveCamera = false;
        this.currentCamera = this.cameraOrthographic;
        this.onResize(container);
    }

    getCamera() : THREE.Camera {
        return this.currentCamera;
    }

    followStone(position : THREE.Vector3) : void {
        // only follow stone when using perspective camera
        if (this.usingPerspectiveCamera) {
            let offsetZ = 5;
            this.cameraPerspective.position.z = position.z + offsetZ;
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
            let zoomFactor = this.cameraOrthographicZoomFactor * containerRect.width * containerRect.height;
            this.cameraOrthographic.left = containerRect.width / -zoomFactor;
            this.cameraOrthographic.right = containerRect.width / zoomFactor;
            this.cameraOrthographic.top = containerRect.height / zoomFactor;
            this.cameraOrthographic.bottom = containerRect.height / -zoomFactor;

            // update current camera aspect
            this.cameraOrthographic.updateProjectionMatrix();
        }
    }
}
