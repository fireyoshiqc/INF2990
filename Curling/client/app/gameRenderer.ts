
import { Injectable } from '@angular/core';
import { CurlingStone } from './curlingStone';
import { SkyBox } from './skyBox';
import { Rink } from './rink';
import { LightManager } from './lightManager';

@Injectable()
export class GameRenderer {

    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    ambientLight: THREE.HemisphereLight;
    isStarted = false;
    stone: CurlingStone;
    lightManager: LightManager;

    constructor() {
        console.log("GameRenderer created successfully");
    }
    public init(container?: HTMLElement) {
        this.scene = new THREE.Scene();

        /*Field of view, aspect ratio, near, far*/
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        //var camera = new THREE.OrthographicCamera( 45, window.innerWidth / window.innerHeight, 1, 500);

        /*We have to set the size at which we want to render our app. We use the width and the height of the browser.*/
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        //document.body.appendChild(this.renderer.domElement);
        if (container !== undefined) {
            if (container.getElementsByTagName('canvas').length === 0) {
                container.appendChild(this.renderer.domElement);
            }
        }
        else {
            document.body.appendChild(this.renderer.domElement);
        }


        /*--------------------LIGHT------------------------------------------ */


        this.lightManager = new LightManager();

        this.ambientLight = new THREE.HemisphereLight(0xffffff, 0x222277, 1.0);

        this.scene.add(this.ambientLight);

        //------------------- END LIGHT------------------------------------------//

        this.camera.position.z = -20;
        this.camera.position.y = 20;

        this.camera.rotation.x -= Math.PI / 2;
        this.camera.rotation.z += Math.PI / 2;

        this.stone = new CurlingStone();
        this.stone.init();
        this.add(this.stone);
        this.render();
        this.isStarted = true;

        let skybox: SkyBox;
        skybox = new SkyBox();
        this.add(skybox);

        let rink: Rink = new Rink(skybox.skyBoxImages);
        rink.position.z = -20;


        //rink.rotation.x = Math.PI / 2;
        rink.position.z = -rink.RINK_LENGTH / 2;
        rink.position.y = rink.POS_RINK_Y;

        this.add(rink);


        this.add(this.lightManager.spawnSpotlights(-2.2, 0, 0, rink));

    }

    render() {
        window.requestAnimationFrame(() => this.render());

        // this.camera.position.z -= 0.04;
        // this.stone.position.z -= 0.04;
        // this.stone.position.x -= 0.0005;
        // this.stone.rotation.y += 0.01;

        this.renderer.render(this.scene, this.camera);
    }

    add(obj: THREE.Group | THREE.Mesh) {
        this.scene.add(obj);
    }

}
