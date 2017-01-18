import { Injectable } from '@angular/core';
import { ObjectCreaterService } from './object-creater.service';

@Injectable()
export class RenderService {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.Renderer;
    private geometry: THREE.Geometry;
    private material: THREE.MeshBasicMaterial;
    private mesh: THREE.Mesh;
    private controls: THREE.OrbitControls;

    private useAngle: boolean;
    private _cam_x: number;
    private _cam_y: number;
    private _cam_z: number;
    private _wf: boolean;
    private clock: THREE.Clock;
    private dt: number;

    private font: THREE.Font;
    private text: string;
    private textMaterial: THREE.MultiMaterial;
    private textGroup: THREE.Group;
    private fontLoader: THREE.FontLoader;
    private textMesh: THREE.Mesh;
    private fontName: string;

    private objectLoader: THREE.ObjectLoader;
    private bbHelper: THREE.BoxHelper;
    private updateBbHelper: boolean;

    private created : THREE.Mesh[];

    constructor() {}

    public init(container: HTMLElement) {

        this.useAngle = false;
        this.clock = new THREE.Clock();

        this.renderer = new THREE.WebGLRenderer({antialias: true, devicePixelRatio: window.devicePixelRatio});
        this.renderer.setSize(window.innerWidth*0.8,window.innerHeight*0.8, true);

        this._cam_x = this._cam_y = 0;
        this._cam_z = 500;
        this.camera= new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,1,5000);
        this.camera.position.set(this._cam_x,this._cam_y,this._cam_z);

        this.scene = new THREE.Scene();


        this.scene.add(new THREE.AmbientLight(0x444444));
        let dirLight = new THREE.DirectionalLight(0xeeeeee);
        dirLight.position.set(0,0,1);
        dirLight.position.normalize();
        this.scene.add(dirLight);

        this.geometry= new THREE.BoxGeometry(200,200,200);
        for ( let i = 0; i < this.geometry.faces.length; i += 2 ) {
            let hex: THREE.Color = new THREE.Color();
            hex.setRGB(Math.random(), Math.random(), Math.random());
            this.geometry.faces[ i ].color = hex;
            this.geometry.faces[ i + 1 ].color = hex;
        }

        this._wf = true;
        this.material= new THREE.MeshBasicMaterial({wireframe: this._wf, vertexColors: THREE.FaceColors});

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);

        let x: THREE.Mesh;
        x = new THREE.Mesh(new THREE.SphereGeometry(150,15,15),
                            new THREE.MeshBasicMaterial({wireframe:true}));

        let plane: THREE.Mesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( 1000, 1000 ),
            new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, transparent: true, wireframe:true})
        );
        plane.position.x = 100;
        plane.position.z = 50;
        this.scene.add(plane);

        // Array to hold our created objects from the factory
        this.created = [];

        // Load the font
        this.fontLoader = new THREE.FontLoader();
        this.textMaterial = new THREE.MultiMaterial([
            new THREE.MeshPhongMaterial({shading: THREE.FlatShading}), // front
            new THREE.MeshPhongMaterial({shading: THREE.SmoothShading})
            ]
        );
        this.textGroup = new THREE.Group();
        this.textGroup.position.y = 100;
        this.scene.add(this.textGroup);
        this.fontName = 'helvetiker_regular';

        /** Load Teapot */
        this.objectLoader = new THREE.ObjectLoader();
        this.loadObject();

        // Inser the canvas into the DOM
        //var container = document.getElementById("glContainer");
        if(container.getElementsByTagName('canvas').length === 0)
            container.appendChild(this.renderer.domElement);
        this.clock.start();
        this.animate();

        // bind to window resizes
        window.addEventListener('resize', _ => this.onResize());

    }

     animate():void {
        window.requestAnimationFrame(_ => this.animate());
        this.dt = this.clock.getDelta();

        this.avancer(this.dt);

        this.mesh.rotation.y += 0.01;
        let tp: THREE.Object3D = this.scene.getObjectByName('Teapot001');
        if (tp !== undefined) {
            (tp as THREE.Mesh).rotateZ(this.dt);
        }
        this.render();

    }

    onWindowResize() {
        let factor = 0.8;
        let newWidth:number = window.innerWidth * factor;
        let newHeight:number = window.innerHeight * factor;

        this.camera.aspect = newWidth / newHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(newWidth, newHeight);
    }

    render(): void {
        //this.renderer.render(this.scene, this.camera);        
        this.renderer.render(this.scene, this.camera);
    }

    toggleWireFrame(): void {
        this._wf = !this._wf;
        this.material.wireframe = this._wf;
        this.material.needsUpdate = true;
    }

    avancer(deltaT: number): void {
        
    }
    onResize() {
        const width = window.innerWidth * 0.95;
        const height = window.innerHeight - 90;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }
    /* This version loads the font each time, not efficient ! */
    slowCreateText() {
        console.log(this);
        this.fontLoader.load('/assets/fonts/helvetiker_regular.typeface.json', r => {
            this.scene.remove(this.textGroup);
            this.textGroup.remove(this.textMesh);
            this.font = new THREE.Font(r);
            let f = Object(r);

            let textGeo: THREE.TextGeometry = new THREE.TextGeometry( this.text, {
                font: f as THREE.Font,
                size:20,
                height: 20,
                curveSegments: 4,
                bevelThickness: 2,
                bevelSize: 1.5,
                bevelEnabled: false
            });
            textGeo.computeBoundingBox();
            textGeo.computeVertexNormals();

            let centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
            this.textMesh = new THREE.Mesh( textGeo, this.textMaterial );
            this.textMesh.position.x = centerOffset;
            this.textMesh.position.y = 50;
            this.textMesh.position.z = 0;
            this.textMesh.rotation.x = 0;
            this.textMesh.rotation.y = Math.PI * 2;
            this.textGroup.add( this.textMesh );
            this.scene.add(this.textGroup);
        });
    }

   

    private refreshText(): void {
        this.slowCreateText();
    }

    public setText(newText:string): void {
        this.text = newText;
        this.refreshText();
    }

    public print(): void {
        console.log(this);
    }

    public translateMesh(x:number,y:number): void {
        //console.log(this);
        this.mesh.position.x += x;
        this.mesh.position.y += y;
    }

    public translateCamera(x:number,y:number, z:number): void {
        this.camera.position.x += x === undefined ? 0 :x ;
        this.camera.position.y += y === undefined ? 0 :y ;
        this.camera.position.z += z === undefined ? 0 :z ;
        this.camera.updateProjectionMatrix();
    }

    public loadObject(): void {
        this.objectLoader.load('/assets/models/json/teapot-claraio.json',obj => {
            obj.position.set(0,0,100);
            obj.scale.set(50,50,50);
            this.mesh.add(obj);
            
            (obj as THREE.Mesh).material =new THREE.MeshPhongMaterial({
                wireframe: false,
                shininess: 0.2,
            });

        });
    }

    public newTeapot():void{
        this.loadObject();
    }

}
