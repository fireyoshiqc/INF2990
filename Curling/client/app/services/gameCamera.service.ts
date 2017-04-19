/**
 * gameCamera.service.ts
 *
 * @authors Erica Bugden et Pierre To
 * @date 2017/02/17
 */

import { Injectable } from '@angular/core';
import { SceneBuilder } from './sceneBuilder.service';

@Injectable()
export class GameCamera {

    private static instance: GameCamera = new GameCamera();
    private cameraPerspective: THREE.PerspectiveCamera;
    private cameraOrthographic: THREE.OrthographicCamera;
    private cameraEndGame: THREE.PerspectiveCamera;
    private currentCamera: THREE.Camera;
    private endGameAngle: number;
    private usingPerspectiveCamera = true; // By default, use perspective camera
    private usingEndGameCamera = false;
    private readonly ORTHO_ZOOM_FACTOR = 75 / 1920; // Determined experimentally
    private readonly PERSPECTIVE_OFFSET = -2;
    private readonly PERSPECTIVE_FOV = 70;
    private readonly PERSPECTIVE_NEAR = 1;
    private readonly PERSPECTIVE_FAR = 10000;
    private readonly PERSPECTIVE_Z_POS = 2;
    private readonly PERSPECTIVE_Y_POS = 1;
    private readonly PERSPECTIVE_X_POS = -Math.PI / 18;
    private readonly ENDGAME_Z_POS = 34.72;
    private readonly ENDGAME_Y_POS = 3;
    private readonly ORTHO_NEAR = 1;
    private readonly ORTHO_FAR = 10000;
    private readonly ORTHO_Z_POS = 23;
    private readonly ORTHO_Y_POS = 5;
    private readonly ORTHO_X_POS = 0;
    private readonly ORTHO_Z_ROT = -Math.PI / 2;
    private readonly ORTHO_X_ROT = -Math.PI / 2;
    private readonly ROTATION_SPEED = Math.PI / 8;

    public static getInstance(): GameCamera {
        return GameCamera.instance;
    }

    private constructor() {
        if (GameCamera.instance) {
            throw new Error("Error: GameCamera is a singleton class, use GameCamera.getInstance() instead of new.");
        }
        GameCamera.instance = this;
    }

    public init(container: HTMLElement): void {
        let containerRect = container.getBoundingClientRect();

        this.initPerspectiveCamera(containerRect);
        this.initOrthographicCamera(containerRect);
        this.initEndGameCamera(containerRect);

        // By default, use perspective camera
        this.currentCamera = this.cameraPerspective;
    }

    private initPerspectiveCamera(containerRect: ClientRect): void {
        // Camera creation
        let aspectPerspective = containerRect.width / containerRect.height;
        this.cameraPerspective = new THREE.PerspectiveCamera(this.PERSPECTIVE_FOV,
            aspectPerspective, this.PERSPECTIVE_NEAR, this.PERSPECTIVE_FAR);

        // Camera position
        this.cameraPerspective.position.z = this.PERSPECTIVE_Z_POS;
        this.cameraPerspective.position.y = this.PERSPECTIVE_Y_POS;
        this.cameraPerspective.rotation.x = this.PERSPECTIVE_X_POS;
    }

    private initOrthographicCamera(containerRect: ClientRect): void {
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

    private initEndGameCamera(containerRect: ClientRect): void {
        // Camera creation
        let aspectPerspective = containerRect.width / containerRect.height;
        this.cameraEndGame = new THREE.PerspectiveCamera(this.PERSPECTIVE_FOV,
            aspectPerspective, this.PERSPECTIVE_NEAR, this.PERSPECTIVE_FAR);

        // Camera position
        this.cameraEndGame.position.z = this.ENDGAME_Z_POS;
        this.cameraEndGame.position.y = this.ENDGAME_Y_POS;
        this.cameraEndGame.rotation.x = this.PERSPECTIVE_X_POS;
    }

    public isUsingPerspectiveCamera(): boolean {
        return this.usingPerspectiveCamera;
    }

    public usePerspectiveCamera(container: HTMLElement): void {
        this.usingPerspectiveCamera = true;
        this.usingEndGameCamera = false;
        this.currentCamera = this.cameraPerspective;
        this.onResize(container);
    }

    public useOrthographicCamera(container: HTMLElement): void {
        this.usingPerspectiveCamera = false;
        this.currentCamera = this.cameraOrthographic;
        this.onResize(container);
    }

    public useEndGameCamera(container: HTMLElement): void {
        this.usingPerspectiveCamera = false;
        this.usingEndGameCamera = true;
        this.endGameAngle = -Math.PI / 2;
        this.currentCamera = this.cameraEndGame;
        this.onResize(container);
        let zPos = SceneBuilder.getInstance().getRinkData().rings.offset;
        this.currentCamera.lookAt(new THREE.Vector3(0, 0, zPos));
    }

    public rotate(delta: number): void {
        let angle = delta * this.ROTATION_SPEED;
        this.endGameAngle += angle;
        let ringOffset = SceneBuilder.getInstance().getRinkData().rings.offset;
        let radius = ringOffset - this.ENDGAME_Z_POS;
        this.currentCamera.position.x = radius * Math.cos(this.endGameAngle);
        this.currentCamera.position.z = radius * Math.sin(this.endGameAngle) + ringOffset;
        this.currentCamera.lookAt(new THREE.Vector3(0, 0, ringOffset));
    }

    public isUsingEndGameCamera(): boolean {
        return this.usingEndGameCamera;
    }

    public getCamera(): THREE.Camera {
        return this.currentCamera;
    }

    public followStone(position: THREE.Vector3): void {
        // Only follow stone when using perspective camera
        if (this.usingPerspectiveCamera) {

            const hog = SceneBuilder.getInstance().getRinkData().lines.hog;
            const back = SceneBuilder.getInstance().getRinkData().lines.back;

            if (position.z <= hog) {
                this.cameraPerspective.position.z = position.z + this.PERSPECTIVE_OFFSET
                    * (1 + position.z / hog);
                this.cameraPerspective.position.y = this.PERSPECTIVE_Y_POS
                    * (1 + position.z / hog);
            }
            else {
                this.cameraPerspective.position.z = position.z + this.PERSPECTIVE_OFFSET
                    * (2 + (position.z - hog) / (0.33 * (back - hog)));
                this.cameraPerspective.position.y = this.PERSPECTIVE_Y_POS
                    * (2 + (position.z - hog) / (0.25 * (back - hog)));
            }

            // Always look at the center of the rings, in order to see all stones in play.
            const offset = SceneBuilder.getInstance().getRinkData().rings.offset;
            this.cameraPerspective.lookAt(new THREE.Vector3(0, 0, offset));
        }
    }

    // When window is resized, change camera aspects
    public onResize(container: HTMLElement): void {
        let containerRect = container.getBoundingClientRect();

        if (this.usingPerspectiveCamera) {
            this.cameraPerspective.aspect = (containerRect.width / containerRect.height);

            // Update current camera aspect
            this.cameraPerspective.updateProjectionMatrix();
        }
        else {
            let zoomFactor = this.ORTHO_ZOOM_FACTOR * containerRect.width;
            this.cameraOrthographic.left = containerRect.width / -zoomFactor;
            this.cameraOrthographic.right = containerRect.width / zoomFactor;
            this.cameraOrthographic.top = containerRect.height / zoomFactor;
            this.cameraOrthographic.bottom = containerRect.height / -zoomFactor;

            // Update current camera aspect
            this.cameraOrthographic.updateProjectionMatrix();
        }
    }
}
