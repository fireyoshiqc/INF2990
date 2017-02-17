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

    // TODO : Remove when experimental test is done
    stone1: CurlingStone;

    public init(container?: HTMLElement): void {
        this.container = container;
        this.scene = new THREE.Scene();

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
        this.physicsManager = new PhysicsManager();
        this.cameraManager = new CameraManager(this.container);

        let skybox: SkyBox;
        skybox = new SkyBox();
        this.add(skybox);

        //TODO: Adjust rink to add play lines (home, throw line, etc.)
        //TODO: Adjust ring positions on the rink (they're wrong right now)
        let rink: Rink = new Rink(skybox.skyBoxImages);
        rink.position.z = -20;
        rink.position.z = -rink.RINK_LENGTH / 2;
        rink.position.y = rink.POS_RINK_Y;
        this.add(rink);

        // ----- Experimental : Adding 7 stones to test the collision ------- //
        this.stone1 = new CurlingStone(new THREE.Vector3(0.2, 0, -5),
            new THREE.Vector3(0, 0, 0));
        this.stone1.init();
        this.stone1.isBeingPlayed = true;
        this.physicsManager.addStone(this.stone1);

        let stone2 = new CurlingStone(new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -rink.RINK_LENGTH / 2));
        stone2.init();
        this.physicsManager.addStone(stone2);

        let stone3 = new CurlingStone(new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.6, 0, -rink.RINK_LENGTH / 2 - 0.5));
        stone3.init();
        this.physicsManager.addStone(stone3);

        let stone4 = new CurlingStone(new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.6, 0, -rink.RINK_LENGTH / 2 - 1.2));
        stone4.init();
        this.physicsManager.addStone(stone4);

        let stone5 = new CurlingStone(new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(-0.5, 0, -rink.RINK_LENGTH / 2 - 0.5));
        stone5.init();
        this.physicsManager.addStone(stone5);

        let stone6 = new CurlingStone(new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -rink.RINK_LENGTH / 2 - 0.9));
        stone6.init();
        this.physicsManager.addStone(stone6);

        let stone7 = new CurlingStone(new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.1, 0, -rink.RINK_LENGTH / 2 - 3));
        stone7.init();
        this.physicsManager.addStone(stone7);

        let stone8 = new CurlingStone(new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(-2, 0, -rink.RINK_LENGTH / 2));
        stone8.init();
        this.physicsManager.addStone(stone8);

        let stone9 = new CurlingStone(new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(2, 0, -rink.RINK_LENGTH / 2 - 1));
        stone9.init();
        this.physicsManager.addStone(stone9);

        // -------------------END Experiment -------------------------------- //

        this.physicsManager.getStones().forEach(stone => {
            this.add(stone);
        });

        /*--------------------LIGHT------------------------------------------ */

        this.scene.add(this.lightManager.spawnAmbientLight(0xffffff, 0x222277));
        this.add(this.lightManager.spawnSpotlights(-2.2, 0, 0, rink));

        //------------------- END LIGHT------------------------------------------//

        //Start asynchronous render loop.
        this.clock = new THREE.Clock();
        this.render();
        this.isStarted = true;
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
        this.cameraManager.followStone(this.stone1.position);
        this.renderer.render(this.scene, this.cameraManager.getCamera());
    }

    add(obj: THREE.Group | THREE.Mesh): void {
        this.scene.add(obj);
    }

    switchCamera() {
        (this.cameraManager.isUsingPerspectiveCamera()) ?
            this.cameraManager.useOrthographicCamera(this.container) :
            this.cameraManager.usePerspectiveCamera(this.container);
    }
}
