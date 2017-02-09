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

@Injectable()
export class GameRenderer {

    container: HTMLElement;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    ambientLight: THREE.HemisphereLight;
    isStarted = false;
    lightManager: LightManager;
    physicsManager: PhysicsManager;

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
        }

        let containerRect = this.container.getBoundingClientRect();
        //Adjust width and height to real container size
        this.renderer.setSize(containerRect.width, containerRect.height);

        /*Field of view, aspect ratio, near, far*/
        this.camera = new THREE.PerspectiveCamera(45,
            containerRect.width / containerRect.height, 1, 10000);
        this.lightManager = new LightManager();
        this.physicsManager = new PhysicsManager();

        let skybox: SkyBox;
        skybox = new SkyBox();
        this.add(skybox);

        let rink: Rink = new Rink(skybox.skyBoxImages);
        rink.position.z = -20;
        rink.position.z = -rink.RINK_LENGTH / 2;
        rink.position.y = rink.POS_RINK_Y;
        this.add(rink);

        // ----- Experimental : Adding 7 stones to test the collision ------- //
        let stone1 = new CurlingStone(new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(0.577, 0, -rink.RINK_LENGTH / 2 + 2));
        stone1.init();
        this.physicsManager.add(stone1);

        let stone2 = new CurlingStone(new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -rink.RINK_LENGTH / 2));
        stone2.init();
        this.physicsManager.add(stone2);

        let stone3 = new CurlingStone(new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.6, 0, -rink.RINK_LENGTH / 2 - 0.5));
        stone3.init();
        this.physicsManager.add(stone3);

        let stone4 = new CurlingStone(new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.6, 0, -rink.RINK_LENGTH / 2 - 1.2));
        stone4.init();
        this.physicsManager.add(stone4);

        let stone5 = new CurlingStone(new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(-0.5, 0, -rink.RINK_LENGTH / 2 - 0.5));
        stone5.init();
        this.physicsManager.add(stone5);

        let stone6 = new CurlingStone(new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -rink.RINK_LENGTH / 2 - 0.9));
        stone6.init();
        this.physicsManager.add(stone6);

        let stone7 = new CurlingStone(new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0.1, 0, -rink.RINK_LENGTH / 2 - 3));
        stone7.init();
        this.physicsManager.add(stone7);

        let stone8 = new CurlingStone(new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(-2, 0, -rink.RINK_LENGTH / 2));
        stone8.init();
        this.physicsManager.add(stone8);

        let stone9 = new CurlingStone(new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(2, 0, -rink.RINK_LENGTH / 2 - 1));
        stone9.init();
        this.physicsManager.add(stone9);

    // -------------------END Experiment -------------------------------- //

        this.camera.position.z = -rink.RINK_LENGTH / 2;
        this.camera.position.y = 8;
        this.camera.rotation.x = -Math.PI / 2;

        this.physicsManager.get().forEach(stone => {
            this.add(stone);
        });

        /*--------------------LIGHT------------------------------------------ */

        this.scene.add(this.lightManager.spawnAmbientLight(0xffffff, 0x222277));
        this.add(this.lightManager.spawnSpotlights(-2.2, 0, 0, rink));

        //------------------- END LIGHT------------------------------------------//

        this.render();
        this.isStarted = true;
    }

    onResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        let containerRect = this.container.getBoundingClientRect();
        //Adjust width and height to real container size
        this.renderer.setSize(containerRect.width, containerRect.height);

        //TODO: Adjust camera FOV following aspect ratio
        this.camera.aspect = (containerRect.width / containerRect.height);
        this.camera.updateProjectionMatrix();
    }

    render(): void {
        window.requestAnimationFrame(() => this.render());

        //TODO: Implement this.physicsManager.update() correctly
        this.physicsManager.update();

        this.physicsManager.detectCollision();

        this.renderer.render(this.scene, this.camera);
    }

    add(obj: THREE.Group | THREE.Mesh): void {
        this.scene.add(obj);
    }
}
