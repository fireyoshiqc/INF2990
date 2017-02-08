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
import { CurlingStonesManager } from './curlingStonesManager';
import { PhysicsManager } from './physicsManager';

@Injectable()
export class GameRenderer {


    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    ambientLight: THREE.HemisphereLight;
    isStarted = false;
    lightManager: LightManager;
    curlingStonesManager: CurlingStonesManager;
    physicsManager: PhysicsManager;
    clock: THREE.Clock;

    public init(container?: HTMLElement): void {
        this.scene = new THREE.Scene();

        /*Field of view, aspect ratio, near, far*/
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        this.lightManager = new LightManager();
        this.physicsManager = new PhysicsManager();
        this.curlingStonesManager = new CurlingStonesManager();

        /*We have to set the size at which we want to render our app. We use the width and the height of the browser.*/
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.clock = new THREE.Clock();

        if (container !== undefined) {
            if (container.getElementsByTagName('canvas').length === 0) {
                container.appendChild(this.renderer.domElement);
            }
        }
        else {
            document.body.appendChild(this.renderer.domElement);
        }

        let skybox: SkyBox;
        skybox = new SkyBox();
        this.add(skybox);

        let rink: Rink = new Rink(skybox.skyBoxImages);
        rink.position.z = -20;
        rink.position.z = -rink.RINK_LENGTH / 2;
        rink.position.y = rink.POS_RINK_Y;
        this.add(rink);

        let stone1 = new CurlingStone(new THREE.Vector3(0, 0, -1),
            new THREE.Vector3(0.5, 0, -rink.RINK_LENGTH / 2 + 1));
        stone1.init();
        this.curlingStonesManager.add(stone1);

        let stone2 = new CurlingStone(new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -rink.RINK_LENGTH / 2));
        stone2.init();
        this.curlingStonesManager.add(stone2);

        this.camera.position.z = -rink.RINK_LENGTH / 2;
        this.camera.position.y = 5;
        this.camera.rotation.x = -Math.PI / 2;

        this.curlingStonesManager.get().forEach(stone => {
            this.add(stone);
        });

        /*--------------------LIGHT------------------------------------------ */

        this.scene.add(this.lightManager.spawnAmbientLight(0xffffff, 0x222277));
        this.add(this.lightManager.spawnSpotlights(-2.2, 0, 0, rink));

        //------------------- END LIGHT------------------------------------------//

        this.render();
        this.isStarted = true;
    }

    render(): void {
        let delta = this.clock.getDelta();
        window.requestAnimationFrame(() => this.render());

        //TODO: Implement this.physicsManager.update() correctly
        this.physicsManager.update();


        //TODO: Move collision logic to physicsManager
        // Calculate vector linking both curling stones
        let curlingStones = this.curlingStonesManager.get();
        let vec = new THREE.Vector3(curlingStones[0].position.x - curlingStones[1].position.x,
            curlingStones[0].position.y - curlingStones[1].position.y,
            curlingStones[0].position.z - curlingStones[1].position.z);

        if (vec.length() !== 0 && vec.length() < curlingStones[0].getDiameter() * 2) {
            curlingStones[0].direction = vec.normalize();
            curlingStones[1].direction = vec.normalize().clone().negate();
        }

        // Scalars are calculated using delta time compared to an expected 60 frames per second (16.67 ms frametime).
        console.log(delta);
        curlingStones[0].position.add(curlingStones[0].direction.clone().multiplyScalar(0.3 * delta));
        curlingStones[1].position.add(curlingStones[1].direction.clone().multiplyScalar(0.3 * delta));

        this.renderer.render(this.scene, this.camera);
    }

    add(obj: THREE.Group | THREE.Mesh): void {
        this.scene.add(obj);
    }
}
