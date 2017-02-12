/**
 * rink.ts - Implements the rink
 *
 * @authors Félix Boulet et Yawen Hou
 * @date 2017/01/20
 */

import { TextureCacher } from "../services/textureCacher";

export class Rink extends THREE.Group {

    //Rink
    readonly POS_RINK_Y = -0.5;
    readonly RINK_LENGTH = 42;
    readonly RINK_WIDTH = 4.4;
    private readonly RINK_HEIGHT = 0.1;

    //Rings
    private readonly CENTER_RADIUS = 0.15;
    private readonly INNER_RADIUS = 0.6;
    private readonly MIDDLE_RADIUS = 1.2;
    private readonly OUTER_RADIUS = 1.8;

    constructor(loaderImages : Array<string>) {
        super();

        //-------------REFLECTIVE TEXTURE-------------------------------------//
        let loader : THREE.CubeTextureLoader;
        loader = new THREE.CubeTextureLoader();

        loader.load(loaderImages, (reflectTexture) => {
            reflectTexture.format = THREE.RGBFormat;
            reflectTexture.mapping = THREE.CubeReflectionMapping;
            //--------------RINGS-------------------------------------------------//

            let whiteIce : THREE.Texture = TextureCacher.load("/assets/textures/white_ice.jpg");
            let redIce : THREE.Texture = TextureCacher.load("/assets/textures/red_ice.jpg");
            let blueIce : THREE.Texture = TextureCacher.load("/assets/textures/blue_ice.jpg");

            whiteIce.wrapS = whiteIce.wrapT = THREE.RepeatWrapping;
            redIce.wrapS = redIce.wrapT = THREE.RepeatWrapping;
            blueIce.wrapS = blueIce.wrapT = THREE.RepeatWrapping;
            whiteIce.repeat.set(4, 40);
            redIce.repeat.set(2, 2);
            blueIce.repeat.set(4, 4);

            let blueRingGeometry : THREE.Geometry = new THREE.RingGeometry(this.MIDDLE_RADIUS, this.OUTER_RADIUS, 40);
            let blueRingMaterial : THREE.Material = new THREE.MeshPhongMaterial({
                side : THREE.DoubleSide,
                reflectivity : 0.5,
                envMap : reflectTexture,
                map : blueIce
            });
            let blueRing : THREE.Mesh = new THREE.Mesh(blueRingGeometry, blueRingMaterial);
            let redRingGeometry : THREE.Geometry = new THREE.RingGeometry(this.CENTER_RADIUS, this.INNER_RADIUS, 40);
            let redRingMaterial : THREE.Material = new THREE.MeshPhongMaterial({
                side: THREE.DoubleSide,
                reflectivity: 0.5,
                envMap: reflectTexture,
                map: redIce
            });
            let redRing : THREE.Mesh = new THREE.Mesh(redRingGeometry, redRingMaterial);

            let rings : THREE.Group = new THREE.Group();
            rings.add(blueRing);
            rings.add(redRing);

            rings.position.y = this.RINK_HEIGHT;
            rings.rotation.x = Math.PI / 2;

            rings.position.z = -(this.RINK_LENGTH / 2 - this.OUTER_RADIUS * 2);

            //-----------FIN RINGS------------------------------------------------//

            //--------------ICE---------------------------------------------------//
            let rinkMaterial : THREE.Material = new THREE.MeshPhongMaterial({
                reflectivity : 0.7,
                envMap : reflectTexture,
                map : whiteIce
            });

            let rinkGeometry : THREE.Geometry = new THREE.BoxGeometry(this.RINK_WIDTH,
                this.RINK_HEIGHT, this.RINK_LENGTH, 32);

            let rink : THREE.Mesh = new THREE.Mesh(rinkGeometry, rinkMaterial);
            //--------------FIN ICE---------------------------------------------------//

            //Assemble
            this.add(rings);
            this.add(rink);

        });
        //-----------END REFLECTIVE TEXTURE-----------------------------------//
    }
}
