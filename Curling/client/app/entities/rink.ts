/**
 * rink.ts - Implements the rink
 *
 * @authors Félix Boulet et Yawen Hou
 * @date 2017/01/20
 */

import { TextureCacher } from "../services/textureCacher";
import { CurlingStone } from "./curlingStone";

export class Rink extends THREE.Group {

    // Rink
    public static readonly POS_RINK_Y = -0.145;
    public static readonly RINK_LENGTH = 46;
    public static readonly RINK_WIDTH = 4.4;
    private static readonly RINK_HEIGHT = 0.1;
    public static readonly HOG_LINE = -11.28;

    // Rings
    private static readonly CENTER_RADIUS = 0.15;
    private static readonly INNER_RADIUS = 0.6;
    private static readonly MIDDLE_RADIUS = 1.2;
    public static readonly OUTER_RADIUS = 1.8;
    public static readonly RINGS_OFFSET = 17.37; // By how much the ring set is off from the center of the rink.
    public static readonly RINGS_CENTER = new THREE.Vector3(0, 0, -Rink.RINK_LENGTH / 2 - Rink.RINGS_OFFSET);

    private sweptSpotsBuffer: THREE.Mesh[] = [];
    private sweptBufferIndex = 0;
    private readonly SWEPT_BUFFER_MAX = 50;

    private reflectTexture: THREE.CubeTexture;
    private loadingDone = false;

    private whiteIce: THREE.Texture;
    private blueIce: THREE.Texture;
    private redIce: THREE.Texture;

    private rinkClipPlanes: THREE.Plane[];

    constructor(loaderImages: Array<string>) {
        super();
        let self = this;
        this.loadTextures();
        this.loadEnvmap(loaderImages, () => {
            self.buildRink();
            self.loadingDone = true;
        });
    }

    private loadTextures(): void {
        this.redIce = TextureCacher.load("/assets/textures/red_ice.jpg");
        this.blueIce = TextureCacher.load("/assets/textures/blue_ice.jpg");
        this.whiteIce = TextureCacher.load("/assets/textures/white_ice.jpg");

        this.redIce.wrapS = this.redIce.wrapT = THREE.RepeatWrapping;
        this.blueIce.wrapS = this.blueIce.wrapT = THREE.RepeatWrapping;
        this.redIce.repeat.set(2, 2);
        this.blueIce.repeat.set(4, 4);
        this.whiteIce.repeat.set(4, 46);
        this.whiteIce.wrapS = this.whiteIce.wrapT = THREE.RepeatWrapping;
    }

    private loadEnvmap(loaderImages: Array<string>, callback: () => void): void {
        let loader: THREE.CubeTextureLoader;
        loader = new THREE.CubeTextureLoader();
        let self = this;
        loader.load(loaderImages, (reflectTexture) => {
            reflectTexture.format = THREE.RGBFormat;
            reflectTexture.mapping = THREE.CubeReflectionMapping;
            self.reflectTexture = reflectTexture;
            callback();
        });
    }

    private buildRink(): void {
        this.buildClipPlanes();
        this.buildIce();
        this.buildSweptBuffer();
        this.buildGameLines();
        this.buildRings();
    }

    private buildClipPlanes(): void {
        let leftPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), Rink.RINK_WIDTH / 2);
        let rightPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), Rink.RINK_WIDTH / 2);
        let frontPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);
        let backPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), Rink.RINK_LENGTH);
        this.rinkClipPlanes = [leftPlane, rightPlane, frontPlane, backPlane];
    }

    private buildRings(): void {

        let blueRingGeometry: THREE.Geometry = new THREE.RingGeometry(Rink.MIDDLE_RADIUS, Rink.OUTER_RADIUS, 40);
        let blueRingMaterial: THREE.Material = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            metalness: 0.6,
            roughness: 0.2,
            envMap: this.reflectTexture,
            envMapIntensity: 1.0,
            map: this.blueIce
        });
        let blueRing: THREE.Mesh = new THREE.Mesh(blueRingGeometry, blueRingMaterial);

        let redRingGeometry: THREE.Geometry = new THREE.RingGeometry(Rink.CENTER_RADIUS, Rink.INNER_RADIUS, 40);
        let redRingMaterial: THREE.Material = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            metalness: 0.6,
            roughness: 0.2,
            envMap: this.reflectTexture,
            envMapIntensity: 1.0,
            map: this.redIce
        });
        let redRing: THREE.Mesh = new THREE.Mesh(redRingGeometry, redRingMaterial);

        let rings: THREE.Group = new THREE.Group();
        rings.add(blueRing);
        rings.add(redRing);

        rings.position.y = Rink.RINK_HEIGHT / 2 + 0.0005;
        rings.rotation.x = -Math.PI / 2;

        rings.position.z = -(Rink.RINGS_OFFSET);

        this.add(rings);
    }

    private buildIce(): void {

        let rinkMaterial: THREE.Material = new THREE.MeshStandardMaterial({
            metalness: 0.6,
            roughness: 0.2,
            envMap: this.reflectTexture,
            envMapIntensity: 1.0,
            map: this.whiteIce
        });

        let rinkGeometry: THREE.Geometry = new THREE.BoxGeometry(Rink.RINK_WIDTH,
            Rink.RINK_HEIGHT, Rink.RINK_LENGTH, 32);

        let rink: THREE.Mesh = new THREE.Mesh(rinkGeometry, rinkMaterial);
        rink.name = "whiteice";

        this.add(rink);

    }

    private buildSweptBuffer(): void {
        let sweptDiscGeometry: THREE.Geometry = new THREE.CircleGeometry(CurlingStone.MAX_RADIUS, 20);
        let discMaterial: THREE.Material = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            metalness: 0.7,
            roughness: 0.0,
            envMap: this.reflectTexture,
            envMapIntensity: 1.0,
            map: this.whiteIce,
        });
        discMaterial.clippingPlanes = this.rinkClipPlanes;

        for (let i = 0; i < this.SWEPT_BUFFER_MAX; i++) {
            let disc: THREE.Mesh = new THREE.Mesh(sweptDiscGeometry, discMaterial);
            disc.position.y = Rink.RINK_HEIGHT / 2 + 0.0001;
            disc.position.z = 50;
            disc.rotation.x = -Math.PI / 2;
            this.sweptSpotsBuffer.push(disc);
            this.add(disc);
        }

    }

    private buildGameLines(): void {
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
        this.add(gameLine);
    }

    public isLoadingDone(): boolean {
        return this.loadingDone;
    }

    public addSpot(x: number, z: number) {
        this.sweptSpotsBuffer[this.sweptBufferIndex].position.x = x;
        this.sweptSpotsBuffer[this.sweptBufferIndex].position.z = z;
        let currentBuffer = this.sweptBufferIndex;
        this.sweptBufferIndex = (this.sweptBufferIndex + 1) % this.SWEPT_BUFFER_MAX;
        return currentBuffer;
    }

    public removeSpot(id: number) {
        this.sweptSpotsBuffer[id].position.z = 50;
        /**
        //TODO: Make the spot fade out. This code works but is buggy with multiple spots at once.

        // let x = 0;
        // let self = this;
        // let intervalID = setInterval(() => {
        //     (<THREE.MeshStandardMaterial>self.sweptSpotsBuffer[id].material).metalness -= 0.001;
        //     (<THREE.MeshStandardMaterial>self.sweptSpotsBuffer[id].material).roughness += 0.002;
        //     if (++x === 100) {
        //         clearInterval(intervalID);
        //         self.sweptSpotsBuffer[id].position.z = 50;
        //         (<THREE.MeshStandardMaterial>self.sweptSpotsBuffer[id].material).metalness = 0.7;
        //         (<THREE.MeshStandardMaterial>self.sweptSpotsBuffer[id].material).roughness = 0.0;
        //     }
        // }, 10);
         */

    }

    public getRinkLength(): number {
        return Rink.RINK_LENGTH;
    }
}
