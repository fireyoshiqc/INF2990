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
import { GameController } from './gameController.service';

@Injectable()
export class GameRenderer {

    private readonly DASH_SIZE = 0.1;
    private readonly GAP_SIZE = 0.1;
    private readonly TRANSLATE_OFFSET = 0.5;
    private readonly SPIN_SPEED = 2 * Math.PI / 3;

    private container: HTMLElement;
    public scene: THREE.Scene; // TODO: Make a getter and adapt tests.
    private renderer: THREE.WebGLRenderer;
    public isStarted = false; // TODO: Make a getter and adapt tests.
    private lightManager: LightManager;
    public physicsManager: PhysicsManager; // TODO: Make a getter and adapt tests.
    private cameraManager: CameraManager;
    private clock: THREE.Clock;
    private raycaster: THREE.Raycaster;
    private curlingStones: CurlingStone[] = [];
    private curveGeometry: THREE.Geometry;
    private curveObject: THREE.Line;

    private gameController: GameController;
    private totalTranslateOffset = 0;
    private curveAngle = 0;
    private rink: Rink;

    // TODO : Remove when experimental test is done
    private activeStone: CurlingStone;

    constructor(curlingStones: CurlingStone[], gameController: GameController) {
        this.curlingStones = curlingStones;
        this.gameController = gameController;
    }

    public init(container?: HTMLElement): void {
        this.container = container;
        this.scene = new THREE.Scene();
        this.raycaster = new THREE.Raycaster();

        /*We have to set the size at which we want to render our app. We use the width and the height of the browser.*/
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.localClippingEnabled = true;

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
        // Adjust width and height to real container size
        this.renderer.setSize(containerRect.width, containerRect.height);

        this.lightManager = new LightManager();
        this.physicsManager = new PhysicsManager(this.curlingStones);
        this.cameraManager = new CameraManager(this.container);

        let skybox: SkyBox;
        skybox = new SkyBox();
        this.addToScene(skybox);

        // TODO: Adjust rink to add play lines (home, throw line, etc.)
        this.rink = new Rink(skybox.skyBoxImages);
        this.rink.position.z = -Rink.RINK_LENGTH / 2;
        this.rink.position.y = Rink.POS_RINK_Y;
        this.rink.name = "rink";
        this.addToScene(this.rink);

        let directionCurve = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -30));
        this.curveGeometry = new THREE.Geometry();
        this.curveGeometry.vertices = directionCurve.getPoints(1);

        this.curveGeometry.computeLineDistances();

        let curveMaterial = new THREE.LineDashedMaterial({
            color: 0xff0000,
            dashSize: this.DASH_SIZE,
            gapSize: this.GAP_SIZE,
        });

        // Create the final object to add to the scene
        this.curveObject = new THREE.Line(this.curveGeometry, curveMaterial);
        this.curveObject.name = "directionalCurve"; // For testing only

        /*--------------------LIGHT------------------------------------------ */

        this.scene.add(this.lightManager.spawnAmbientLight(0xffffff, 0x000077));
        this.addToScene(this.lightManager.spawnSpotlights(-2.2, 0, 0, this.rink));

        /*------------------ END LIGHT-----------------------------------------*/

        // Start asynchronous render loop.
        this.clock = new THREE.Clock();
        this.isStarted = true;
    }

    public addStone(stone: CurlingStone): void {
        this.addToScene(stone);
        this.activeStone = stone;
    }

    public onResize(event: any) {
        this.renderer.setSize(event.target.innerWidth, event.target.innerHeight);
        let containerRect = this.container.getBoundingClientRect();
        // Adjust width and height to real container size
        this.renderer.setSize(containerRect.width, containerRect.height);

        // Adjust camera FOV following aspect ratio
        this.cameraManager.onResize(this.container);
    }

    public addToScene(obj: THREE.Group | THREE.Mesh): void {
        this.scene.add(obj);
    }

    public switchCamera(): void {
        (this.cameraManager.isUsingPerspectiveCamera()) ?
            this.cameraManager.useOrthographicCamera(this.container) :
            this.cameraManager.usePerspectiveCamera(this.container);
    }

    public calculateAngle(mouse: THREE.Vector2): number {
        let intersects = this.checkIfMouseOnIce(mouse);
        if (intersects.length > 0) {
            let intersectionPoint = intersects[0].point;
            let distance = intersectionPoint.x;
            let angle = distance / (Rink.RINK_WIDTH / 2) * 30;
            this.curveAngle = THREE.Math.degToRad(angle);
            return angle;
        }
        return null;
    }

    public checkIfMouseOnIce(mouse: THREE.Vector2): THREE.Intersection[] {
        this.raycaster.setFromCamera(mouse, this.cameraManager.getCamera());
        let intersects = this.raycaster.intersectObject(this.scene.getObjectByName("rink"), true);
        return intersects;
    }

    public getRink(): Rink {
        return this.rink;
    }

    public updateDirectionCurve(angleDifference: number): void {
        this.curveObject.geometry.rotateY(THREE.Math.degToRad(angleDifference));
        // Update end point of the directional line
        this.curveGeometry.vertices[1] = this.getFurthestCollisionPoint();
    }

    public showDirectionCurve(): void {
        this.scene.add(this.curveObject);
    }

    public hideDirectionCurve(): void {
        this.scene.remove(this.curveObject);
    }

    private removeOutOfBoundsStones(outOfBoundsStones: CurlingStone[]) {
        outOfBoundsStones.forEach(stone => {
            let index = this.curlingStones.indexOf(stone);
            this.curlingStones.splice(index, 1);
            stone.fadeOut();
        });
    }

    private highlightStonesWorthPoints() {
        let teamClosestStone = this.curlingStones[0].getTeam();
        let index = 0;

        while (this.curlingStones.length > index &&
               this.curlingStones[index].getTeam() === teamClosestStone &&
               this.curlingStones[index].position.distanceTo(Rink.RINGS_CENTER) < Rink.OUTER_RADIUS) {
            this.curlingStones[index++].highlightOn();
        }
    }

    public removeHighlightFromStones() {
        this.curlingStones.forEach(stone => {
            stone.highlightOff();
        });
    }

    private getFurthestCollisionPoint(): THREE.Vector3 {
        let x = 0, z = 0;
        // Bordure
        if (this.curveAngle !== 0) {
            x = Math.sign(this.curveAngle) * Rink.RINK_WIDTH / 2;
            z = -x / Math.tan(this.curveAngle);
        }
        if (-z > Rink.RINK_LENGTH) {
            z = -Rink.RINK_LENGTH;
            x = -z * Math.tan(this.curveAngle);
        }

        let shortestDistance = Rink.RINK_LENGTH;
        this.curlingStones.forEach(curlingStone => {
            let angle = -Math.atan(curlingStone.position.x / curlingStone.position.z);
            let distance = curlingStone.position.distanceTo(new THREE.Vector3(0, 0, 0));
            let error = Math.asin(CurlingStone.MAX_RADIUS / distance);
            if (distance <= shortestDistance && this.curveAngle < angle + error && this.curveAngle > angle - error) {
                shortestDistance = distance;
                z = curlingStone.position.z;
                x = -z * Math.tan(this.curveAngle);
            }
        });

        return new THREE.Vector3(x, 0, z);
    }

    public render(): void {
        window.requestAnimationFrame(() => this.render());

        let delta = this.clock.getDelta();
        this.physicsManager.update(delta);
        this.removeOutOfBoundsStones(this.physicsManager.getOutOfBoundsStones());
        let self = this;
        this.physicsManager.getDecayedSpots().forEach(spot => {
            self.rink.removeSpot(spot.id);
        });
        this.physicsManager.cleanDecayedSpots();

        // Ligne de direction - Fourmillement
        let scalarOffset = this.TRANSLATE_OFFSET * delta;
        this.totalTranslateOffset += scalarOffset;

        this.curveObject.translateX(scalarOffset * Math.sin(this.curveAngle));
        this.curveObject.translateZ(-scalarOffset * Math.cos(this.curveAngle));

        if (this.totalTranslateOffset > this.DASH_SIZE * 2) {
            this.curveObject.position.x = 0;
            this.curveObject.position.z = 0;
            this.totalTranslateOffset = 0;
        }

        // Rotate the active stone
        if (this.activeStone !== undefined && this.activeStone.getVelocity().length() > 0.1) {
            this.activeStone.rotateY(this.activeStone.getSpinOrientation() * delta * this.SPIN_SPEED);
        }

        // Render scene using camera that is following the stone
        if (this.activeStone !== undefined) {
            this.cameraManager.followStone(this.activeStone.position);
        }

        this.renderer.render(this.scene, this.cameraManager.getCamera());

        if (this.physicsManager.allStonesHaveStopped() && this.gameController.isInSweepingState()) {
            this.physicsManager.sortStonesByDistance();
            this.highlightStonesWorthPoints();
            this.gameController.enterIdleState();
        }
    }
}
