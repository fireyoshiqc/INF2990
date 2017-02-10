/**
 * curlingStone.ts - Implements a curling stone
 *
 * @authors Félix Boulet et Yawen Hou
 * @date 2017/01/20
 */

export class CurlingStone extends THREE.Group {

    static readonly MAX_RADIUS = 0.145 * 2; //External radius of the stone
    private readonly RADIUS = 0.145; //Radius of stone (torus)
    private readonly HEIGHT = 0.290; //Height of stone (base).
    private readonly SFACES = 25; //Amount of faces for stone rendering.
    private readonly HRADIUS = 0.025; //Radius of handle tube.
    private readonly HFACES = 6; //Amount of faces for handle rendering.
    private readonly WEIGHT = 19.96; //Weight of a single curling stone.

    private texLoader: THREE.TextureLoader;
    stoneColor: string;
    direction: THREE.Vector3;

    constructor(direction?: THREE.Vector3, position?: THREE.Vector3, aColor?: string) {
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

        if (direction) {
            this.direction = direction.normalize();
        }
        if (position) {
            this.position.set(position.x, position.y, position.z);
        }
    }

    //Function for random stone color
    getRandomColor() : string {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    getCurlingStoneWeight() : number {
        return this.WEIGHT;
    }

    init() : void {
        this.texLoader = new THREE.TextureLoader();

        //Stone base
        let torusGeometry : THREE.TorusGeometry;
        torusGeometry = new THREE.TorusGeometry(this.RADIUS, this.RADIUS, this.SFACES, this.SFACES);
        let cylinderGeometry : THREE.CylinderGeometry;
        cylinderGeometry = new THREE.CylinderGeometry(this.RADIUS, this.RADIUS,
                                                      this.HEIGHT, this.SFACES);

        let torus : THREE.Mesh = new THREE.Mesh(torusGeometry);
        let cylinder : THREE.Mesh = new THREE.Mesh(cylinderGeometry);
        cylinder.rotation.x = Math.PI / 2;

        //Merge base geometry
        let curlingGeometry: THREE.Geometry = new THREE.Geometry();

        torus.updateMatrix();
        curlingGeometry.merge(<THREE.Geometry>torus.geometry, torus.matrix);
        cylinder.updateMatrix();
        curlingGeometry.merge(<THREE.Geometry>cylinder.geometry, cylinder.matrix);

        // Material for stone base
        let material : THREE.MeshStandardMaterial;
        let texture : THREE.Texture;
        texture = this.texLoader.load('/assets/textures/granite.jpg');

        material = new THREE.MeshStandardMaterial({
            metalness : 0.0,
            roughness : 0.2,
            map : texture
        });

        let curlingMesh : THREE.Mesh = new THREE.Mesh(curlingGeometry, material);
        //-------------------- END CURLING BASE------------------------------------------ //

        /*-------------------- CURLING HANDLE------------------------------------------ */
        // Material for cover and tube
        let handleMaterial : THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
            metalness : 0.5,
            roughness : 0.2,
            color : this.getRandomColor(),
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
        let tubeGeometry: THREE.TubeGeometry = new THREE.TubeGeometry(curve, 10, this.HRADIUS, this.HFACES, false);
        let tube: THREE.Mesh = new THREE.Mesh(tubeGeometry);
        tube.position.y = this.RADIUS - 0.005;
        tube.position.x = -this.RADIUS;

        //End of tube
        let sphereGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(this.HRADIUS, this.HFACES, this.HFACES);
        let sphere: THREE.Mesh = new THREE.Mesh(sphereGeometry);
        sphere.position.y = this.RADIUS + 0.075;
        sphere.position.x = -this.RADIUS + 0.26;

        //Merge handle geometry
        let handleGeometry: THREE.Geometry = new THREE.Geometry();

        cover.updateMatrix();
        handleGeometry.merge(<THREE.Geometry>cover.geometry, cover.matrix);
        tube.updateMatrix();
        handleGeometry.merge(<THREE.Geometry>tube.geometry, tube.matrix);
        sphere.updateMatrix();
        handleGeometry.merge(<THREE.Geometry>sphere.geometry, sphere.matrix);

        let handleMesh : THREE.Mesh = new THREE.Mesh(handleGeometry, handleMaterial);

        curlingMesh.rotation.x = Math.PI / 2;
        this.add(curlingMesh);
        this.add(handleMesh);
    }
}
