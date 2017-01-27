
export class CurlingStone extends THREE.Group {

    private readonly RADIUS: number = 0.145; //Radius of stone.
    private readonly HEIGHT: number = 0.290; //Height of stone (base).
    private readonly SFACES: number = 25; //Amount of faces for stone rendering.
    private readonly HANRAD: number = 0.025; //Radius of handle tube.
    private readonly HFACES: number = 6; //Amount of faces for handle rendering.


    stoneColor: string;

    constructor(aColor?: string) {
      super();
        if (aColor) {
            let regex = new RegExp('#[0-9a-fA-F]{6}');
            if (regex.test(aColor)) {
                this.stoneColor = aColor;
            }
            else {
                this.stoneColor = "#FFFFFF";
            }
        }
        else {
            this.stoneColor = "#FFFFFF";
        }
    }

    //Function for random stone color
    getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    init() {
        //Stone base
        let torusGeometry: THREE.TorusGeometry;
        torusGeometry = new THREE.TorusGeometry(this.RADIUS, this.RADIUS, this.SFACES, this.SFACES);
        let cylinderGeometry: THREE.CylinderGeometry;
        cylinderGeometry = new THREE.CylinderGeometry(this.RADIUS, this.RADIUS, this.HEIGHT, this.SFACES);

        let torus: THREE.Mesh = new THREE.Mesh(torusGeometry);
        let cylinder: THREE.Mesh = new THREE.Mesh(cylinderGeometry);
        cylinder.rotation.x = Math.PI / 2;

        //Merge base geometry
        let curlingGeometry: THREE.Geometry = new THREE.Geometry();

        torus.updateMatrix();
        curlingGeometry.merge(<THREE.Geometry> torus.geometry, torus.matrix);
        cylinder.updateMatrix();
        curlingGeometry.merge(<THREE.Geometry> cylinder.geometry, cylinder.matrix);

        // Material for stone base
        let material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
            metalness: 0.0,
            roughness: 0.2,
            //TODO: Replace THREE.ImageUTils.loadTexture by new loader (this is deprecated)
            map: THREE.ImageUtils.loadTexture("../assets/textures/granite.jpg"),
            // color : 0xffffff

        });

        let curlingMesh: THREE.Mesh = new THREE.Mesh(curlingGeometry, material);
        //scene.add(curlingMesh);
        //-------------------- END CURLING BASE------------------------------------------ //

        /*-------------------- CURLING HANDLE------------------------------------------ */
        //Material for cover and tube
        let handleMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
            metalness: 0.5,
            roughness: 0.2,
            color: this.getRandomColor(),
        });

        //Cover
        let coverGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(this.RADIUS, 0.2, 0.01, 25);
        let cover: THREE.Mesh = new THREE.Mesh(coverGeometry);
        cover.position.y = this.RADIUS;

        //Curve for handle, 3D Spline curve
        let curve: THREE.CatmullRomCurve3 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.05, 0.08, 0),
            new THREE.Vector3(0.26, 0.08, 0)
        ]);


        //Tube
        let tubeGeometry: THREE.TubeGeometry = new THREE.TubeGeometry(curve, 10, this.HANRAD, this.HFACES, false);
        let tube: THREE.Mesh = new THREE.Mesh(tubeGeometry);
        tube.position.y = this.RADIUS - 0.005;
        tube.position.x = -this.RADIUS;

        //End of tube
        let sphereGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(this.HANRAD, this.HFACES, this.HFACES);
        let sphere: THREE.Mesh = new THREE.Mesh(sphereGeometry);
        sphere.position.y = this.RADIUS + 0.03;
        sphere.position.x = -this.RADIUS + 0.26;


        //Merge handle geometry
        let handleGeometry: THREE.Geometry = new THREE.Geometry();

        cover.updateMatrix();
        handleGeometry.merge(<THREE.Geometry> cover.geometry, cover.matrix);
        tube.updateMatrix();
        handleGeometry.merge(<THREE.Geometry> tube.geometry, tube.matrix);
        sphere.updateMatrix();
        handleGeometry.merge(<THREE.Geometry> sphere.geometry, sphere.matrix);

        let handleMesh: THREE.Mesh = new THREE.Mesh(handleGeometry, handleMaterial);

        curlingMesh.rotation.x = Math.PI / 2;
        this.add(curlingMesh);
        this.add(handleMesh);
    }
}

//
// let scene: THREE.Scene = new THREE.Scene();
//
// /*Field of view, aspect ratio, near, far*/
// let camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
// //var camera = new THREE.OrthographicCamera( 45, window.innerWidth / window.innerHeight, 1, 500);
//
// /*We have to set the size at which we want to render our app. We use the width and the height of the browser.*/
// let renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);
//
// /*--------------------LIGHT------------------------------------------ */
// let directLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
// directLight.position.set(2, 50, 0);
// scene.add(directLight);
//
// let ambientLight: THREE.HemisphereLight = new THREE.HemisphereLight(0xffffff, 0x777777, 1.0);
//
// scene.add(ambientLight);
// //------------------- END LIGHT------------------------------------------//
//
//
//
// scene.add(group);
//
//
// camera.position.z = 5;
//
// /*Render loop*/
// function render() {
//     requestAnimationFrame(render);
//
//     /*Animatin the cube*/
//     group.rotation.x += 0.001;
//     group.rotation.y += 0.01;
//
//     renderer.render(scene, camera);
// }
//
// render();
//
// }
