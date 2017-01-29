
import { Injectable } from '@angular/core';
import { CurlingStone } from './curlingStone';
import { SkyBox } from './skyBox';

@Injectable()
export class GameRenderer {

    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    directLight: THREE.DirectionalLight;
    ambientLight: THREE.HemisphereLight;
    isStarted = false;

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
        this.directLight = new THREE.DirectionalLight(0xffffff, 1.0);
        this.directLight.position.set(2, 50, 0);
        this.scene.add(this.directLight);

        this.ambientLight = new THREE.HemisphereLight(0xffffff, 0x777777, 1.0);

        this.scene.add(this.ambientLight);
        //------------------- END LIGHT------------------------------------------//

        this.camera.position.z = 6;
        this.camera.position.y = 2;
        this.camera.rotation.x -= 0.2;
        let stone: CurlingStone;
        stone = new CurlingStone();
        stone.init();
        this.add(stone);
        this.render();
        this.isStarted = true;

        let skybox: SkyBox;
        skybox = new SkyBox();
        this.add(skybox);

        //Reflective camera
        // let reflectiveCamera = new THREE.CubeCamera(1, 10000, 512);
        // this.add(reflectiveCamera);

        //let reflectiveTexture = new THREE.CubeTextureLoader().load(skybox.skyBoxImages);
        // reflectiveTexture.format = THREE.RGBFormat;
        //reflectiveTexture.mapping = THREE.CubeReflectionMapping;

        let POS_RINK_Y = -0.5;
        let CENTER_RADIUS = 0.15;
        let INNER_RADIUS = 0.6;
        let MIDDLE_RADIUS = 1.2;
        let OUTER_RADIUS = 1.83;
        let RINK_LENGTH = 42;
        let RINK_WIDTH = 4.4;

        //TODO: Change ice texture to make it tileable (power of 2 on each side).
        let textureLoader = new THREE.TextureLoader().load("/assets/textures/ice.jpg");
        textureLoader.mapping = THREE.EquirectangularReflectionMapping;

        //TODO: Change ice material to make it reflective.
        let planeGeometry = new THREE.PlaneGeometry(RINK_WIDTH, RINK_LENGTH, 32);
        let planeMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide
        });
        planeMaterial.envMap = textureLoader;

        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        //plane.rotation.x = Math.PI/2;
        //plane.position.y = POS_RINK_Y;
        //plane.position.z = POS_RINK_Z;


        //TODO: Change ring materials to make them reflective.
        let blueRingGeometry = new THREE.RingGeometry(MIDDLE_RADIUS, OUTER_RADIUS, 40);
        let blueRingMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide });
        let blueRing = new THREE.Mesh(blueRingGeometry, blueRingMaterial);
        let redRingGeometry = new THREE.RingGeometry(CENTER_RADIUS, INNER_RADIUS, 40);
        let redRingMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
        let redRing = new THREE.Mesh(redRingGeometry, redRingMaterial);


        let rings = new THREE.Group();
        rings.add(blueRing);
        rings.add(redRing);
        //
        //rings.position.y = 1;
        //  rings.position.z = -0.1;
        // rings.position.y = POS_RINK_Y;

        let rings2 = new THREE.Group();
        rings2.add(blueRing);
        rings2.add(redRing);

        //this.add(rings2);
        //this.add(rings);

        rings2.position.y = -(RINK_LENGTH / 2 - 3.7);
        rings2.position.z = -0.1;

        let rink = new THREE.Group();
        rink.add(rings);
        rink.add(rings2);
        rink.add(plane);


        rink.rotation.x = Math.PI / 2;
        rink.position.z = -RINK_LENGTH / 2;
        rink.position.y = POS_RINK_Y;

        this.add(rink);

    }

    render() {
        window.requestAnimationFrame(() => this.render());

        this.renderer.render(this.scene, this.camera);
    }

    add(obj: THREE.Group | THREE.Mesh) {
        this.scene.add(obj);
    }

}
