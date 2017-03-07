/**
 * rink.ts - Implements the rink
 *
 * @authors Félix Boulet et Yawen Hou
 * @date 2017/01/20
 */

import { TextureCacher } from "../services/textureCacher";

export class Rink extends THREE.Group {

    //Rink
    static readonly POS_RINK_Y = -0.145;
    static readonly RINK_LENGTH = 46;
    static readonly RINK_WIDTH = 4.4;
    private static readonly RINK_HEIGHT = 0.1;
    static readonly HOG_LINE = -11.28;

    //Rings
    private static readonly CENTER_RADIUS = 0.15;
    private static readonly INNER_RADIUS = 0.6;
    private static readonly MIDDLE_RADIUS = 1.2;
    static readonly OUTER_RADIUS = 1.8;
    static readonly RINGS_OFFSET = 17.37; //By how much the ring set is off from the center of the rink.

    constructor(loaderImages: Array<string>) {
        super();

        //-------------REFLECTIVE TEXTURE-------------------------------------//
        let loader: THREE.CubeTextureLoader;
        loader = new THREE.CubeTextureLoader();

        loader.load(loaderImages, (reflectTexture) => {
            reflectTexture.format = THREE.RGBFormat;
            reflectTexture.mapping = THREE.CubeReflectionMapping;

            //--------------RINGS-------------------------------------------------//

            let whiteIce: THREE.Texture = TextureCacher.load("/assets/textures/white_ice.jpg");
            let redIce: THREE.Texture = TextureCacher.load("/assets/textures/red_ice.jpg");
            let blueIce: THREE.Texture = TextureCacher.load("/assets/textures/blue_ice.jpg");

            whiteIce.wrapS = whiteIce.wrapT = THREE.RepeatWrapping;
            redIce.wrapS = redIce.wrapT = THREE.RepeatWrapping;
            blueIce.wrapS = blueIce.wrapT = THREE.RepeatWrapping;
            whiteIce.repeat.set(4, 46);
            redIce.repeat.set(2, 2);
            blueIce.repeat.set(4, 4);

            let blueRingGeometry: THREE.Geometry = new THREE.RingGeometry(Rink.MIDDLE_RADIUS, Rink.OUTER_RADIUS, 40);
            let blueRingMaterial: THREE.Material = new THREE.MeshStandardMaterial({
                side: THREE.DoubleSide,
                metalness: 0.6,
                roughness: 0.2,
                envMap: reflectTexture,
                envMapIntensity: 1.0,
                map: blueIce
            });
            let blueRing: THREE.Mesh = new THREE.Mesh(blueRingGeometry, blueRingMaterial);
            let redRingGeometry: THREE.Geometry = new THREE.RingGeometry(Rink.CENTER_RADIUS, Rink.INNER_RADIUS, 40);
            let redRingMaterial: THREE.Material = new THREE.MeshStandardMaterial({
                side: THREE.DoubleSide,
                metalness: 0.6,
                roughness: 0.2,
                envMap: reflectTexture,
                envMapIntensity: 1.0,
                map: redIce
            });
            let redRing: THREE.Mesh = new THREE.Mesh(redRingGeometry, redRingMaterial);

            let rings: THREE.Group = new THREE.Group();
            rings.add(blueRing);
            rings.add(redRing);

            rings.position.y = Rink.RINK_HEIGHT / 2 + 0.001;
            rings.rotation.x = -Math.PI / 2;

            rings.position.z = -(Rink.RINGS_OFFSET);

            //-----------FIN RINGS------------------------------------------------//

            //--------------ICE---------------------------------------------------//
            let rinkMaterial: THREE.Material = new THREE.MeshStandardMaterial({
                metalness: 0.6,
                roughness: 0.2,
                envMap: reflectTexture,
                envMapIntensity: 1.0,
                map: whiteIce
            });

            let rinkGeometry: THREE.Geometry = new THREE.BoxGeometry(Rink.RINK_WIDTH,
                Rink.RINK_HEIGHT, Rink.RINK_LENGTH, 32);

            let rink: THREE.Mesh = new THREE.Mesh(rinkGeometry, rinkMaterial);
            //--------------FIN ICE---------------------------------------------------//

            //------------PROOF OF CONCEPT SWEEPING-----------------------------------//
            let sweptDiscGeometry: THREE.Geometry = new THREE.CircleGeometry(0.500, 20);
            let discMaterial: THREE.Material = new THREE.MeshStandardMaterial({
                side: THREE.DoubleSide,
                metalness: 0.7,
                roughness: 0.0,
                envMap: reflectTexture,
                envMapIntensity: 1.0,
                map: whiteIce
            });

            for (let i = 0; i < 50; i++) {
                let disc: THREE.Mesh = new THREE.Mesh(sweptDiscGeometry, discMaterial);
                this.add(disc);
                disc.position.x = Math.pow((0.02 * i), 2);
                disc.position.y = Rink.RINK_HEIGHT / 2 + 0.001;
                disc.position.z = 20 - 0.145 * i;
                disc.rotation.x = -Math.PI / 2;
            }
            //------------END OF PROOF OF CONCEPT SWEEPING------------------------------//

            //--------------GAME LINE---------------------------------------------------//
            let gameLineMaterial = new THREE.LineBasicMaterial({
                color: 0xff0000
            });

            let gameLineGeometry = new THREE.Geometry();
            gameLineGeometry.vertices.push(
                new THREE.Vector3(-Rink.RINK_WIDTH / 2 + 0.05,
                    Rink.RINK_HEIGHT, (Rink.RINK_LENGTH / 2) + Rink.HOG_LINE),
                new THREE.Vector3(Rink.RINK_WIDTH / 2 - 0.05, Rink.RINK_HEIGHT, (Rink.RINK_LENGTH / 2) + Rink.HOG_LINE)
            );

            let gameLine = new THREE.Line(gameLineGeometry, gameLineMaterial);

            //--------------END GAME LINE---------------------------------------------------//

            //Assemble
            this.add(gameLine);
            this.add(rings);
            this.add(rink);

        });
        //-----------END REFLECTIVE TEXTURE-----------------------------------//
    }
}
