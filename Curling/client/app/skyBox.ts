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
      this.imageName = "../assets/textures/sb_iceflow/iceflow_";
      console.log(this.imageName);
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
      console.log(this.imageSuffix);
    }

    let skyBoxMaterials = [];
    for (let i = 0; i < 6; i++) {
      skyBoxMaterials.push(this.createMaterial(this.imageName + this.directions[i] + this.imageSuffix));
    }

    //Add material for the sides of the cube
    this.material = new THREE.MultiMaterial(skyBoxMaterials);

    //Set x scale to be -1 to turn the cube inside out
    this.scale.set(-1, 1, 1);

    console.log("skybox created");
  }

  createMaterial(image: string) {
        let texture = new THREE.TextureLoader().load(image);
        let material = new THREE.MeshBasicMaterial({ map: texture, overdraw : 0.5});
        return material;
  }

}
