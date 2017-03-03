/**
 * gameRenderer.ts - Renders the scene
 *
 * @authors Félix Boulet et Yawen Hou
 * @date 2017/01/27
 */

import { Injectable } from '@angular/core';
import { CurlingStone } from '../entities/curlingStone';
import { SkyBox } from '../entities/skyBox';
import { Rink } from '../entities/rink';
import { LightManager } from './lightManager';
import { PhysicsManager } from './physicsManager';
import { CameraManager } from './cameraManager.service';

@Injectable()
export class GameRenderer {

    container: HTMLElement;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    ambientLight: THREE.HemisphereLight;
    isStarted = false;
    lightManager: LightManager;
    physicsManager: PhysicsManager;
    cameraManager: CameraManager;
    clock: THREE.Clock;
    raycaster: THREE.Raycaster;
    curlingStones: CurlingStone[] = [];
    directionCurve: THREE.LineCurve3;
    curveObject: THREE.Line;

    // TODO : Remove when experimental test is done
    activeStone: CurlingStone;

    constructor(curlingStones: CurlingStone[]) {
        this.curlingStones = curlingStones;
    }

    public init(container?: HTMLElement): void {
        this.container = container;
        this.scene = new THREE.Scene();
        this.raycaster = new THREE.Raycaster();

        /*We have to set the size at which we want to render our app. We use the width and the height of the browser.*/
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        if (this.container !== undefined) {
            if (this.container.getElementsByTagName('canvas').length === 0) {
                this.container.appendChild(this.renderer.domElement);
            }
        }
        else {
            document.body.appendChild(this.renderer.domElement);
            this.container = document.body;
        }

        let containerRect = this.container.getBoundingClientRect();
        //Adjust width and height to real container size
        this.renderer.setSize(containerRect.width, containerRect.height);

        this.lightManager = new LightManager();
        this.physicsManager = new PhysicsManager(this.curlingStones);
        this.cameraManager = new CameraManager(this.container);

        let skybox: SkyBox;
        skybox = new SkyBox();
        this.addToScene(skybox);

        //TODO: Adjust rink to add play lines (home, throw line, etc.)
        //TODO: Adjust ring positions on the rink (they're wrong right now)
        let rink: Rink = new Rink(skybox.skyBoxImages);
        rink.position.z = -Rink.RINK_LENGTH / 2;
        rink.position.y = Rink.POS_RINK_Y;
        rink.name = "rink";
        this.addToScene(rink);

        this.directionCurve = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -10));
        let curveGeometry = new THREE.Geometry();
        curveGeometry.vertices = this.directionCurve.getPoints(2);

        let curveMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

        // Create the final object to add to the scene
        this.curveObject = new THREE.Line(curveGeometry, curveMaterial);


        /*--------------------LIGHT------------------------------------------ */

        this.scene.add(this.lightManager.spawnAmbientLight(0xffffff, 0x222277));
        this.addToScene(this.lightManager.spawnSpotlights(-2.2, 0, 0, rink));

        //------------------- END LIGHT------------------------------------------//

        //Start asynchronous render loop.
        this.clock = new THREE.Clock();
        this.isStarted = true;
    }

    addStone(stone: CurlingStone): void {
        this.addToScene(stone);
        this.activeStone = stone;
    }

    onResize(event: any) {
        this.renderer.setSize(event.target.innerWidth, event.target.innerHeight);
        let containerRect = this.container.getBoundingClientRect();
        //Adjust width and height to real container size
        this.renderer.setSize(containerRect.width, containerRect.height);

        //Adjust camera FOV following aspect ratio
        this.cameraManager.onResize(this.container);
    }

    render(): void {
        window.requestAnimationFrame(() => this.render());

        //TODO: Implement this.physicsManager.update() correctly
        let delta = this.clock.getDelta();
        this.physicsManager.update(delta);

        //Render scene using camera that is following the stone
        this.cameraManager.followStone(this.activeStone.position);
        this.renderer.render(this.scene, this.cameraManager.getCamera());
    }

    addToScene(obj: THREE.Group | THREE.Mesh): void {
        this.scene.add(obj);
    }

    switchCamera(): void {
        (this.cameraManager.isUsingPerspectiveCamera()) ?
            this.cameraManager.useOrthographicCamera(this.container) :
            this.cameraManager.usePerspectiveCamera(this.container);
    }

    calculateAngle(mouse: THREE.Vector2): number {
        this.raycaster.setFromCamera(mouse, this.cameraManager.getCamera());
        let intersects = this.raycaster.intersectObject(this.scene.getObjectByName("rink"), true);
        if (intersects.length > 0) {
            let intersectionPoint = intersects[0].point;
            let distance = intersectionPoint.x;
            let angle = distance / (Rink.RINK_WIDTH / 2) * 30;
            return angle;
        }
        return null;
    }

    updateDirectionCurve(angle: number): void {
        this.curveObject.geometry.rotateY(THREE.Math.degToRad(angle));
    }

    showDirectionCurve(): void {
        this.scene.add(this.curveObject);
    }

    hideDirectionCurve(): void {
        this.scene.remove(this.curveObject);
    }
}
