import { Injectable } from '@angular/core'

@Injectable()
export class ObjectCreaterService {
    private objectLoader: THREE.ObjectLoader;
    private c: number = 0;
    private init(): void{
        this.objectLoader = new THREE.ObjectLoader();
    }

    private addAttributes(object: THREE.Object3D): void {
        object.name = object.name.replace(/[0-9]/g,'');
        object.name +=  (this.c++).toString();
        object.userData.vie = new THREE.Vector3(0,0,0);

    }

    private initAttributes(object: THREE.Object3D): void {
        object.scale.set(1,1,1);
    }

    constructor(){
        this.init();
    }

    /**
     * createTeapot
     */
    public createTeapot(): Promise<THREE.Object3D> {
        return new Promise<THREE.Mesh>((resolve,error) => {
            this.objectLoader.load('/assets/models/json/teapot-claraio.json',obj => {
                if (obj === undefined){
                    error("Unable to load teapot");
                } else {
                    this.addAttributes(obj);
                    this.initAttributes(obj);
                    resolve(obj as THREE.Mesh);
                }
            });
        });
    }
}