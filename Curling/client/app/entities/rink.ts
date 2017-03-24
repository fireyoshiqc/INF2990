/**
 * rink.ts - Implements the rink
 *
 * @authors Félix Boulet et Yawen Hou
 * @date 2017/01/20
 */

import { TextureCacher } from "../services/textureCacher";
import { CurlingStone } from "./curlingStone";
import { AudioManager } from "../services/audioManager.service";

export class Rink extends THREE.Group {

    // Rink
    public static readonly POS_RINK_Y = -0.145; // Y position of the rink
    public static readonly RINK_LENGTH = 46; // Length in meters
    public static readonly RINK_WIDTH = 4.4; // Width in meters
    private static readonly RINK_HEIGHT = 0.1; // Thickness of the ice plane
    public static readonly HOG_LINE = -11.28; // Where the hog line is relative to the end of the ice plane
    public static readonly BACK_LINE = -3.80; // Where the back line is relative to the end of the ice plane

    // Rings
    private static readonly CENTER_RADIUS = 0.15; // Radius of the white dot at the center of the house
    private static readonly INNER_RADIUS = 0.6; // Radius of red ring in the house
    private static readonly MIDDLE_RADIUS = 1.2; // Inner radius of blue ring in the house
    public static readonly OUTER_RADIUS = 1.8; // Outer radius of blue ring in the house
    public static readonly RINGS_OFFSET = 17.37; // By how much the ring set is off from the center of the rink
    public static readonly RINGS_CENTER = new THREE.Vector3(0, 0, -Rink.RINK_LENGTH / 2 - Rink.RINGS_OFFSET);
    // Position of the center of the house, relative to the start of the ice plane

    private sweptSpotsBuffer: THREE.Mesh[] = [];
    private sweptBufferIndex = 0;
    private readonly SWEPT_BUFFER_MAX = 50; // Max amount of swept ice spots to display

    // All textures and associated variables
    private reflectTexture: THREE.CubeTexture;
    private loadingDone = false;

    private whiteIce: THREE.Texture;
    private blueIce: THREE.Texture;
    private redIce: THREE.Texture;

    // Clipping planes to prevent swept ice spots to extend past the ice
    private rinkClipPlanes: THREE.Plane[];

    private audioManager: AudioManager;

    constructor(loaderImages: Array<string>, audioManager?: AudioManager) {
        super();
        if (audioManager !== undefined) {
            this.audioManager = audioManager;
        }
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

    // Load envmap to create reflection on the ice
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

    // Place clipping planes around the ice plane
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

        rings.position.y = 0.0001;
        rings.rotation.x = -Math.PI / 2;

        rings.position.z = -(Rink.RINGS_OFFSET);

        this.add(rings);

        // Decorative set of rings near where the stone is thrown
        let blueRingDeco: THREE.Mesh = new THREE.Mesh(blueRingGeometry, blueRingMaterial);
        let redRingDeco: THREE.Mesh = new THREE.Mesh(redRingGeometry, redRingMaterial);

        let ringsDeco: THREE.Group = new THREE.Group();
        ringsDeco.add(blueRingDeco);
        ringsDeco.add(redRingDeco);

        ringsDeco.position.y = 0.0001;
        ringsDeco.rotation.x = -Math.PI / 2;

        ringsDeco.position.z = Rink.RINGS_OFFSET;

        this.add(ringsDeco);
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
        rink.position.y = - Rink.RINK_HEIGHT / 2;

        this.add(rink);
    }

    private buildSweptBuffer(): void {
        let sweptDiscGeometry: THREE.Geometry = new THREE.CircleGeometry(CurlingStone.MAX_RADIUS, 20);

        // Create the buffer of swept ice spots and hide them where they can't be seen while they aren't in use
        for (let i = 0; i < this.SWEPT_BUFFER_MAX; i++) {
            let discMaterial: THREE.Material = new THREE.MeshStandardMaterial({
                side: THREE.DoubleSide,
                metalness: 0.8,
                roughness: 0.0,
                envMap: this.reflectTexture,
                envMapIntensity: 1.0,
                map: this.whiteIce,
            });
            discMaterial.clippingPlanes = this.rinkClipPlanes;
            let disc: THREE.Mesh = new THREE.Mesh(sweptDiscGeometry, discMaterial);
            disc.position.y = 0.00005;
            disc.position.z = 50;
            disc.rotation.x = -Math.PI / 2;
            this.sweptSpotsBuffer.push(disc);
            this.add(disc);
        }

    }

    private buildGameLines(): void {
        // All decos are lines that aren't essential to gameplay
        let centerLineMaterial = new THREE.MeshStandardMaterial({
            color: 0x333355,
            metalness: 0.6,
            roughness: 0.2,
            envMap: this.reflectTexture,
            envMapIntensity: 1.0,
        });

        let centerLineGeometry = new THREE.PlaneGeometry(0.03, Rink.RINK_LENGTH);
        let centerLine = new THREE.Mesh(centerLineGeometry, centerLineMaterial);
        centerLine.position.x = 0;
        centerLine.position.y = 0.0002;
        centerLine.position.z = 0;
        centerLine.rotation.x = -Math.PI / 2;
        this.add(centerLine);

        let hogLineMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            metalness: 0.6,
            roughness: 0.2,
            envMap: this.reflectTexture,
            envMapIntensity: 1.0,
        });

        let hogLineGeometry = new THREE.PlaneGeometry(Rink.RINK_WIDTH, 0.08);

        let hogLine = new THREE.Mesh(hogLineGeometry, hogLineMaterial);
        hogLine.position.x = 0;
        hogLine.position.y = 0.0003;
        hogLine.position.z = (Rink.RINK_LENGTH / 2) + Rink.HOG_LINE;
        hogLine.rotation.x = -Math.PI / 2;
        this.add(hogLine);

        let hogLineDeco = new THREE.Mesh(hogLineGeometry, hogLineMaterial);
        hogLineDeco.position.x = 0;
        hogLineDeco.position.y = 0.0003;
        hogLineDeco.position.z = -(Rink.RINK_LENGTH / 2) - Rink.HOG_LINE;
        hogLineDeco.rotation.x = -Math.PI / 2;
        this.add(hogLineDeco);

        let backLineGeometry = new THREE.PlaneGeometry(Rink.RINK_WIDTH, 0.03);

        let backLine = new THREE.Mesh(backLineGeometry, centerLineMaterial);
        backLine.position.x = 0;
        backLine.position.y = 0.0002;
        backLine.position.z = (Rink.RINK_LENGTH / 2) + Rink.BACK_LINE;
        backLine.rotation.x = -Math.PI / 2;
        this.add(backLine);

        let backLineDeco = new THREE.Mesh(backLineGeometry, centerLineMaterial);
        backLineDeco.position.x = 0;
        backLineDeco.position.y = 0.0002;
        backLineDeco.position.z = -(Rink.RINK_LENGTH / 2) - Rink.BACK_LINE;
        backLineDeco.rotation.x = -Math.PI / 2;
        this.add(backLineDeco);


        let teeLine = new THREE.Mesh(backLineGeometry, centerLineMaterial);
        teeLine.position.x = 0;
        teeLine.position.y = 0.0002;
        teeLine.position.z = - Rink.RINGS_OFFSET;
        teeLine.rotation.x = -Math.PI / 2;
        this.add(teeLine);

        let teeLineDeco = new THREE.Mesh(backLineGeometry, centerLineMaterial);
        teeLineDeco.position.x = 0;
        teeLineDeco.position.y = 0.0002;
        teeLineDeco.position.z = Rink.RINGS_OFFSET;
        teeLineDeco.rotation.x = -Math.PI / 2;
        this.add(teeLineDeco);
    }

    public isLoadingDone(): boolean {
        return this.loadingDone;
    }

    public addSpot(x: number, z: number): number {
        this.sweptSpotsBuffer[this.sweptBufferIndex].position.x = x;
        this.sweptSpotsBuffer[this.sweptBufferIndex].position.z = z;
        let currentBuffer = this.sweptBufferIndex;
        // Increment buffer index to get the next spot to add. Will loop if there are 50 spots on the ice.
        this.sweptBufferIndex = (this.sweptBufferIndex + 1) % this.SWEPT_BUFFER_MAX;
        return currentBuffer;
    }

    public getSpot(id: number): THREE.Mesh {
        return this.sweptSpotsBuffer[id];
    }

    public isSpotFaded(id: number): boolean {
        if ((<THREE.MeshStandardMaterial>this.sweptSpotsBuffer[id].material).metalness < 0.6
            || (<THREE.MeshStandardMaterial>this.sweptSpotsBuffer[id].material).roughness > 0.2) {
            this.removeSpot(id);
            return true;
        }
        return false;

    }

    public fadeSpot(id: number, delta: number): void {
        (<THREE.MeshStandardMaterial>this.sweptSpotsBuffer[id].material).metalness -= 0.2 * delta;
        (<THREE.MeshStandardMaterial>this.sweptSpotsBuffer[id].material).roughness += 0.2 * delta;

    }

    private removeSpot(id: number): void {
        this.sweptSpotsBuffer[id].position.z = 50;
        (<THREE.MeshStandardMaterial>this.sweptSpotsBuffer[id].material).metalness = 0.8;
        (<THREE.MeshStandardMaterial>this.sweptSpotsBuffer[id].material).roughness = 0.0;
    }

    public cleanAllSpots(): void {
        // Hide all spots by placing there somewhere far away
        for (let spot of this.sweptSpotsBuffer) {
            spot.position.z = 50;
        }
        this.sweptBufferIndex = 0;
    }

    public getRinkLength(): number {
        return Rink.RINK_LENGTH;
    }

    public getAudioManager(): AudioManager {
        return this.audioManager;
    }
}
