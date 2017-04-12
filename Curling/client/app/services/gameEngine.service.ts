/**
 * gameEngine.service.ts
 *
 * @authors Félix Boulet
 * @date 2017/03/26
 */

import { SceneBuilder } from './sceneBuilder.service';
import { GameCamera } from './gameCamera.service';
import { GameAudio } from './gameAudio.service';

import { GameController } from './gameController.service';
import { CurlingStone } from '../entities/curlingStone';
import { FastIce } from '../entities/fastIce';
import { Rink } from '../entities/rink';


export class GameEngine {

    private static instance: GameEngine = new GameEngine();

    private container: HTMLElement;
    private scene: THREE.Scene;
    private camera: GameCamera;
    private audio: GameAudio;
    private renderer: THREE.WebGLRenderer;
    private clock: THREE.Clock;
    private raycaster: THREE.Raycaster;

    private curlingStones: Array<CurlingStone> = [];
    private activeStone: CurlingStone;
    private fastIceBuffer: Array<FastIce> = [];

    private controller: GameController;

    public static getInstance(): GameEngine {
        return GameEngine.instance;
    }

    private constructor() {
        if (GameEngine.instance) {
            throw new Error("Error: GameEngine is a singleton class, use GameEngine.getInstance() instead of new.");
        }
        GameEngine.instance = this;
    }

    public async init(container: HTMLElement, controller: GameController): Promise<any> {

        this.container = container;
        this.controller = controller;
        this.createRenderer();
        let self = this;
        let initPromise = new Promise((resolve, reject) => {
            SceneBuilder.getInstance().buildScene()
                .then((scene) => {
                    self.scene = scene;
                    self.setupCamera();
                    self.setupAudio();
                    resolve();
                }).catch(() => {
                    reject();
                    throw new Error("ERROR: Could not build game scene (unresolved promise).");
                });
        });

        return initPromise;
    }

    public update(): void {
        window.requestAnimationFrame(() => this.update());
        const delta = this.clock.getDelta();
        this.controller.updateState(delta);
        if (this.activeStone) {
            this.camera.followStone(this.activeStone.position);
        }
        this.renderer.render(this.scene, this.camera.getCamera());
    }

    public checkIntersectIce(mouse: THREE.Vector2): THREE.Intersection[] {
        this.raycaster.setFromCamera(mouse, this.camera.getCamera());
        let intersects = this.raycaster.intersectObject(this.scene
            .getObjectByName("rink").getObjectByName("whiteice"), true);
        return intersects;
    }

    public addStone(stone: CurlingStone): void {
        // Create copies of the audio so it can play multiple times at once.
        stone.add(this.audio.getSlidingSound());
        stone.add(this.audio.getCollisionSound());
        this.curlingStones.push(stone);
        this.activeStone = stone;
        this.scene.add(stone);
    }

    public removeHighlightOnAllStones(): void {
        this.curlingStones.forEach(stone => { stone.highlightOff(); });
    }

    public addFastIceSpot(position: THREE.Vector3): void {
        new FastIce().init(this.scene.getObjectByName("rink") as Rink)
            .then((fastIce) => {
                fastIce.position.set(position.x, position.y, position.z);
                fastIce.add(this.audio.getSweepingSound());
                this.fastIceBuffer.push(fastIce);
                this.scene.add(fastIce);
                (<THREE.PositionalAudio>fastIce.getObjectByName("sweepingSound")).play();
            });
    }

    public getStones(): Array<CurlingStone> {
        return this.curlingStones;
    }

    public getActiveStone(): CurlingStone {
        return this.activeStone;
    }

    public getFastIceBuffer(): Array<FastIce> {
        return this.fastIceBuffer;
    }

    public addToScene(obj: THREE.Object3D): void {
        this.scene.add(obj);
    }

    public removeFromScene(obj: THREE.Object3D): void {
        this.scene.remove(obj);
    }

    public removeAllStones(): void {
        this.curlingStones.forEach((stone) => {
            // Stop all sounds
            const slidingSound = <THREE.PositionalAudio>(stone.getObjectByName("slidingSound"));
            if (slidingSound !== undefined && slidingSound.isPlaying) {
                slidingSound.stop();
            }
            const collisionSound = <THREE.PositionalAudio>(stone.getObjectByName("collisionSound"));
            if (collisionSound !== undefined && collisionSound.isPlaying) {
                collisionSound.stop();
            }
            // Remove stone from scene
            this.removeFromScene(stone);
        });

        // Empty the curlingStone array
        this.curlingStones.splice(0);
    }

    // Called when the browser window gets resized
    public onResize(event: any): void {
        this.renderer.setSize(event.target.innerWidth, event.target.innerHeight);
        let containerRect = this.container.getBoundingClientRect();
        // Adjust width and height to real container size
        this.renderer.setSize(containerRect.width, containerRect.height);

        // Adjust camera FOV following aspect ratio
        this.camera.onResize(this.container);
    }

    public switchCamera(): void {
        (this.camera.isUsingPerspectiveCamera()) ?
            this.camera.useOrthographicCamera(this.container) :
            this.camera.usePerspectiveCamera(this.container);
    }

    private createRenderer(): void {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.localClippingEnabled = true;
        this.renderer.physicallyCorrectLights = true;
        this.checkHardwareCapabilities();

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
        this.clock = new THREE.Clock();
        this.raycaster = new THREE.Raycaster();
    }

    // Disable shadows on Intel integrated graphics since it has a large performance hit.
    private checkHardwareCapabilities(): void {
        const gl = this.renderer.getContext();
        const hardware = gl.getExtension('WEBGL_debug_renderer_info');
        const vendor: string = gl.getParameter(hardware.UNMASKED_RENDERER_WEBGL);
        if (vendor.toLowerCase().includes("intel")) {
            this.renderer.shadowMap.enabled = false;
        } else {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }
    }

    private setupCamera(): void {
        this.camera = GameCamera.getInstance();
        this.camera.init(this.container);
    }

    private setupAudio(): void {
        this.audio = GameAudio.getInstance();
        this.audio.init(this.camera);
    }
}
