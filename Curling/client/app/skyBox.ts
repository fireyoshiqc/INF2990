//Skybox
export class SkyBox extends THREE.Mesh {
  //Textures
  imageName : string;
  directions : Array<string>;
  imageSuffix : string;

  //The list contains the textures.jpg for the skybox in the same order as the attribute
  constructor(imageName?: string, directions?: Array<string>, imageSuffix?: string) {
    //Create cube
    super(new THREE.BoxGeometry(10000, 10000, 10000, 1, 1, 1));
    if (imageName) {
      this.imageName = "../assets/textures/" + imageName;
    } else {
      this.imageName = "../assets/textures/iceflow_";
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
    for (let i = 0; i < 6; i++) {
      skyBoxMaterials.push(this.createMaterial(imageName + directions[i] + imageSuffix));
    }

    //Add material for the sides of the cube
    this.material = new THREE.MultiMaterial(skyBoxMaterials);

    //Set x scale to be -1 to turn the cube inside out
    this.scale.set(-1, 1, 1);

  }

  createMaterial(image: string) {
        let texture = new THREE.TextureLoader().load(image);
        let material = new THREE.MeshBasicMaterial({ map: texture, overdraw : 0.5});
        return material;
  }

}
