
export class GameRenderer {

    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    directLight: THREE.DirectionalLight;
    ambientLight: THREE.HemisphereLight;

    constructor() {
    }
    init() {
        this.scene = new THREE.Scene();

        /*Field of view, aspect ratio, near, far*/
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
        //var camera = new THREE.OrthographicCamera( 45, window.innerWidth / window.innerHeight, 1, 500);

        /*We have to set the size at which we want to render our app. We use the width and the height of the browser.*/
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        /*--------------------LIGHT------------------------------------------ */
        this.directLight = new THREE.DirectionalLight(0xffffff, 1.0);
        this.directLight.position.set(2, 50, 0);
        this.scene.add(this.directLight);

        this.ambientLight = new THREE.HemisphereLight(0xffffff, 0x777777, 1.0);

        this.scene.add(this.ambientLight);
        //------------------- END LIGHT------------------------------------------//


        this.camera.position.z = 5;

    }

    render() {
        requestAnimationFrame(this.render);

        this.renderer.render(this.scene, this.camera);
    }

    add(obj: THREE.Group | THREE.Mesh){
      this.scene.add(obj);

    }

}
