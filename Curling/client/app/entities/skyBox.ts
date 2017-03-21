/**
 * skyBox.ts - Inializes a skybox
 *
 * @authors Félix Boulet et Yawen Hou
 * @date 2017/01/20
 */

import { TextureCacher } from "../services/textureCacher";

export class SkyBox extends THREE.Mesh {
    // Textures
    public imageName: string;
    public directions: Array<string>;
    public imageSuffix: string;
    public skyBoxImages: Array<string>;

    // The list contains the textures.jpg for the skybox in the same order as the attribute
    constructor(imageName?: string, directions?: Array<string>, imageSuffix?: string) {
        // Create cube
        super(new THREE.BoxGeometry(10000, 10000, 10000, 1, 1, 1));
        if (imageName) {
            this.imageName = "../assets/textures/" + imageName;
        } else {
            this.imageName = "../assets/textures/sb_iceflow/iceflow_";
        }

        if (directions) {
            this.directions = directions;
        } else {
            this.directions = ["lf", "rt", "up", "dn", "ft", "bk"];
        }

        if (imageSuffix) {
            this.imageSuffix = imageSuffix;
        } else {
            this.imageSuffix = ".jpg";
        }

        let skyBoxMaterials = [];
        let skyBoxImages = [];

        for (let i = 0; i < 6; i++) {
            skyBoxImages.push(this.imageName + this.directions[i] + this.imageSuffix);
            skyBoxMaterials.push(this.createMaterial(this.imageName + this.directions[i] + this.imageSuffix));
        }

        this.skyBoxImages = skyBoxImages;

        // Add material for the sides of the cube
        this.material = new THREE.MultiMaterial(skyBoxMaterials);

        // Set x scale to be -1 to turn the cube inside out
        this.scale.set(-1, 1, 1);

    }

    private createMaterial(image: string): THREE.MeshBasicMaterial {
        let texture = TextureCacher.load(image);
        let material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, map: texture, overdraw: 0.5 });
        return material;
    }
}
