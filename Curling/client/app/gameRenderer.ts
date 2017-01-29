
import { Injectable } from '@angular/core';
import { CurlingStone } from './curlingStone';
import { SkyBox } from './skyBox';
import { Rink } from './rink';
import { SpotlightArray } from './lightManager';

@Injectable()
export class GameRenderer {

    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    directLight: THREE.DirectionalLight;
    ambientLight: THREE.HemisphereLight;
    isStarted = false;
    stone: CurlingStone;

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
        // this.directLight = new THREE.DirectionalLight(0xffffff, 1.0);
        // this.directLight.position.set(2, 50, 0);
        // this.scene.add(this.directLight);

        this.ambientLight = new THREE.HemisphereLight(0xffffff, 0x222277, 1.0);

        this.scene.add(this.ambientLight);



        // for (let i = 0; i < 6; i++) {
        //     for (let j = 0; j < 2; j++) {
        //         let sunlight = new THREE.SpotLight(0xffffff, 0.6);
        //         sunlight.position.set(-2.2 + 4.4 * j, 5, -i * 8);
        //         sunlight.penumbra = 0.4;
        //         this.scene.add(sunlight);
        //         let lightTarget = new THREE.Object3D();
        //         lightTarget.position.set(-2.2 + 4.4 * j, 0, -i * 8);
        //         this.scene.add(lightTarget);
        //         sunlight.target = lightTarget;
        //
        //     }
        // }


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

        let rink : Rink = new Rink (skybox.skyBoxImages);
        rink.position.z = -20;


        //rink.rotation.x = Math.PI / 2;
        rink.position.z = -rink.RINK_LENGTH / 2;
        rink.position.y = rink.POS_RINK_Y;

        this.add(rink);

        let spotlights = new SpotlightArray(rink.RINK_WIDTH, rink.RINK_LENGTH, 2, 6);
        spotlights.position.x = -2.2;
        this.add(spotlights);

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
