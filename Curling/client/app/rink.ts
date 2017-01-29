
export class Rink extends THREE.Group {

//Rink
readonly POS_RINK_Y: number = -0.5;
readonly RINK_LENGTH: number = 42;
private readonly RINK_WIDTH: number = 4.4;
private readonly RINK_HEIGHT: number = 0.1;

//Rings
private readonly CENTER_RADIUS = 0.15;
private readonly INNER_RADIUS: number = 0.6;
private readonly MIDDLE_RADIUS: number = 1.2;
private readonly OUTER_RADIUS: number = 1.8;

  constructor(loaderImages: Array<string>) {
    super();
    console.log("constructor called");
    //--------------RINGS-------------------------------------------------//

    let textureLoader: THREE.TextureLoader = new THREE.TextureLoader();
    let whiteice: THREE.Texture = textureLoader.load("/assets/textures/white_ice.jpg");
    let redice: THREE.Texture = textureLoader.load("/assets/textures/red_ice.jpg");
    let blueice: THREE.Texture = textureLoader.load("/assets/textures/blue_ice.jpg");

    whiteice.wrapS = whiteice.wrapT = THREE.RepeatWrapping;
    redice.wrapS = redice.wrapT = THREE.RepeatWrapping;
    blueice.wrapS = blueice.wrapT = THREE.RepeatWrapping;
    whiteice.repeat.set(4, 40);
    redice.repeat.set(2, 2);
    blueice.repeat.set(4, 4);

    let blueRingGeometry: THREE.Geometry = new THREE.RingGeometry(this.MIDDLE_RADIUS, this.OUTER_RADIUS, 40);
    let blueRingMaterial: THREE.Material = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      roughness: 0.0,
      metalness: 0.5,
      map: blueice});
    let blueRing: THREE.Mesh = new THREE.Mesh(blueRingGeometry, blueRingMaterial);
    let redRingGeometry: THREE.Geometry = new THREE.RingGeometry( this.CENTER_RADIUS, this.INNER_RADIUS, 40);
    let redRingMaterial: THREE.Material = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      roughness: 0.0,
      metalness: 0.5,
      map: redice});
    let redRing: THREE.Mesh = new THREE.Mesh(redRingGeometry, redRingMaterial);


    let rings: THREE.Group = new THREE.Group();
     rings.add(blueRing);
     rings.add(redRing);

     rings.position.y = this.RINK_HEIGHT;
     rings.rotation.x = Math.PI/2;

    rings.position.z = -(this.RINK_LENGTH / 2 - this.OUTER_RADIUS*2);

    console.log("rings created");
    //-----------FIN RINGS.................................................//

    //--------------ICE---------------------------------------------------//
    let loader: THREE.CubeTextureLoader;
    loader = new THREE.CubeTextureLoader();

    //!!let textureCube: THREE.Texture;
    //!!textureCube = loader.load(loaderImages);

    //!!textureCube.format = THREE.RGBFormat;
    //!!textureCube.mapping = THREE.CubeReflectionMapping;
    let rinkMaterial: THREE.Material = new THREE.MeshPhongMaterial( {
      //metalness: 0.5,
      //roughness: 0.0,
      //!!envMap: textureCube,
      map: whiteice
    } );

    let rinkGeometry: THREE.Geometry = new THREE.BoxGeometry( this.RINK_WIDTH, this.RINK_HEIGHT, this.RINK_LENGTH, 32 );

    let rink: THREE.Mesh = new THREE.Mesh( rinkGeometry, rinkMaterial );
    //--------------FIN ICE---------------------------------------------------//

    console.log("ice created");

    //Assemble
    this.add(rings);
    this.add(rink);

    console.log("assembled");
  }

}
