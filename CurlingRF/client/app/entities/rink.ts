/**
 * rink.ts - Implements the rink - refactored
 *
 * @authors Félix Boulet (et Yawen Hou à l'origine)
 * @date 2017/03/26
 */

import { TextureCacher } from "../utils/textureCacher.util";


export class Rink extends THREE.Group {

    private readonly LOCAL_SURFACE_SETUP: ISurfaceSetup = {
        length: 46, width: 4.4, height: 0.1
    };

    private readonly LOCAL_RING_SETUP: IRingSetup = {
        center: 0.15, inner: 0.6, middle: 1.2, outer: 1.8,
        offset: 17.37
    };

    private readonly LOCAL_LINE_SETUP: ILineSetup = {
        hog: 11.72, back: 19.2, start: -21.1
    };
    // All textures and associated variables
    private reflectTexture: THREE.CubeTexture;
    private loadingDone = false;

    private whiteIce: THREE.Texture;
    private blueIce: THREE.Texture;
    private redIce: THREE.Texture;

    // Clipping planes to prevent swept ice spots to extend past the ice
    private rinkClipPlanes: THREE.Plane[];

    constructor() {
        super();
    }

    public init(loaderImages: Array<string>): Promise<Rink> {
        let self = this;
        let initPromise = new Promise((resolve, reject) => {
            self.loadTextures();
            self.loadEnvmap(loaderImages, () => {
                self.buildRink();
                resolve(self);
            });
        });
        return initPromise;
    }

    public getDimensions(): ISurfaceSetup {
        return this.LOCAL_SURFACE_SETUP;
    }

    public getRefRingSetup(): IRingSetup {
        const local = this.LOCAL_RING_SETUP;
        const surface = this.LOCAL_SURFACE_SETUP;
        return {
            center: local.center, inner: local.inner, middle: local.middle, outer: local.outer,
            offset: local.offset + surface.length / 2
        };
    }

    public getRefLineSetup(): ILineSetup {
        const local = this.LOCAL_LINE_SETUP;
        const surface = this.LOCAL_SURFACE_SETUP;
        return {
            hog: local.hog + surface.length / 2,
            back: local.back + surface.length / 2,
            start: local.start + surface.length / 2
        };
    }

    public getWhiteIceTexture(): THREE.Texture {
        return this.whiteIce;
    }

    public getReflectTexture(): THREE.CubeTexture {
        return this.reflectTexture;
    }

    public getClippingPlanes(): Array<THREE.Plane> {
        return this.rinkClipPlanes;
    }

    public isLoadingDone(): boolean {
        return this.loadingDone;
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
        this.buildGameLines();
        this.buildRings();
    }

    // Place clipping planes around the ice plane
    private buildClipPlanes(): void {
        let leftPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), this.LOCAL_SURFACE_SETUP.width / 2);
        let rightPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), this.LOCAL_SURFACE_SETUP.width / 2);
        let frontPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        let backPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), this.LOCAL_SURFACE_SETUP.length);
        this.rinkClipPlanes = [leftPlane, rightPlane, frontPlane, backPlane];
    }

    private buildIce(): void {

        const surface = this.LOCAL_SURFACE_SETUP;

        let rinkMaterial: THREE.Material = new THREE.MeshStandardMaterial({
            metalness: 0.6,
            roughness: 0.2,
            envMap: this.reflectTexture,
            envMapIntensity: 1.0,
            map: this.whiteIce
        });

        let rinkGeometry: THREE.Geometry = new THREE.BoxGeometry(surface.width,
            surface.height, surface.length, 32);

        let rink: THREE.Mesh = new THREE.Mesh(rinkGeometry, rinkMaterial);
        rink.name = "whiteice";
        rink.position.y = - surface.height / 2;
        rink.castShadow = false;
        rink.receiveShadow = true;
        this.add(rink);
    }

    private buildRings(): void {
        const center = this.LOCAL_RING_SETUP.center;
        const inner = this.LOCAL_RING_SETUP.inner;
        const middle = this.LOCAL_RING_SETUP.middle;
        const outer = this.LOCAL_RING_SETUP.outer;
        const offset = this.LOCAL_RING_SETUP.offset;

        let redRingGeometry: THREE.Geometry = new THREE.RingGeometry(center, inner, 40);
        let redRingMaterial: THREE.Material = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            metalness: 0.6,
            roughness: 0.2,
            envMap: this.reflectTexture,
            envMapIntensity: 1.0,
            map: this.redIce
        });
        let redRing: THREE.Mesh = new THREE.Mesh(redRingGeometry, redRingMaterial);
        redRing.castShadow = false;
        redRing.receiveShadow = true;

        let blueRingGeometry: THREE.Geometry = new THREE.RingGeometry(middle, outer, 40);
        let blueRingMaterial: THREE.Material = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            metalness: 0.6,
            roughness: 0.2,
            envMap: this.reflectTexture,
            envMapIntensity: 1.0,
            map: this.blueIce
        });
        let blueRing: THREE.Mesh = new THREE.Mesh(blueRingGeometry, blueRingMaterial);
        blueRing.castShadow = false;
        blueRing.receiveShadow = true;

        let rings: THREE.Group = new THREE.Group();
        rings.add(blueRing);
        rings.add(redRing);

        rings.position.y = 0.0001;
        rings.rotation.x = -Math.PI / 2;

        rings.position.z = offset;

        this.add(rings);

        // Decorative set of rings near where the stone is thrown
        let blueRingDeco: THREE.Mesh = new THREE.Mesh(blueRingGeometry, blueRingMaterial);
        let redRingDeco: THREE.Mesh = new THREE.Mesh(redRingGeometry, redRingMaterial);

        let ringsDeco: THREE.Group = new THREE.Group();
        ringsDeco.add(blueRingDeco);
        ringsDeco.add(redRingDeco);

        ringsDeco.position.y = 0.0001;
        ringsDeco.rotation.x = -Math.PI / 2;

        ringsDeco.position.z = -offset;

        this.add(ringsDeco);
    }

    private buildGameLines(): void {

        const surface = this.LOCAL_SURFACE_SETUP;
        const hogline = this.LOCAL_LINE_SETUP.hog;
        const backline = this.LOCAL_LINE_SETUP.back;
        const teeline = this.LOCAL_RING_SETUP.offset;

        // All decos are lines that aren't essential to gameplay
        let centerLineMaterial = new THREE.MeshStandardMaterial({
            color: 0x333355,
            metalness: 0.6,
            roughness: 0.2,
            envMap: this.reflectTexture,
            envMapIntensity: 1.0,
        });

        let centerLineGeometry = new THREE.PlaneGeometry(0.03, surface.length);
        let centerLine = new THREE.Mesh(centerLineGeometry, centerLineMaterial);
        centerLine.position.x = 0;
        centerLine.position.y = 0.0002;
        centerLine.position.z = 0;
        centerLine.rotation.x = -Math.PI / 2;
        centerLine.castShadow = false;
        centerLine.receiveShadow = true;
        this.add(centerLine);

        let hogLineMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            metalness: 0.6,
            roughness: 0.2,
            envMap: this.reflectTexture,
            envMapIntensity: 1.0,
        });

        let hogLineGeometry = new THREE.PlaneGeometry(surface.width, 0.08);

        let hogLine = new THREE.Mesh(hogLineGeometry, hogLineMaterial);
        hogLine.position.x = 0;
        hogLine.position.y = 0.0003;
        hogLine.position.z = hogline;
        hogLine.rotation.x = -Math.PI / 2;
        hogLine.castShadow = false;
        hogLine.receiveShadow = true;
        this.add(hogLine);

        let hogLineDeco = new THREE.Mesh(hogLineGeometry, hogLineMaterial);
        hogLineDeco.position.x = 0;
        hogLineDeco.position.y = 0.0003;
        hogLineDeco.position.z = -hogline;
        hogLineDeco.rotation.x = -Math.PI / 2;
        hogLineDeco.castShadow = false;
        hogLineDeco.receiveShadow = true;
        this.add(hogLineDeco);

        let backLineGeometry = new THREE.PlaneGeometry(surface.width, 0.03);

        let backLine = new THREE.Mesh(backLineGeometry, centerLineMaterial);
        backLine.position.x = 0;
        backLine.position.y = 0.0002;
        backLine.position.z = backline;
        backLine.rotation.x = -Math.PI / 2;
        backLine.castShadow = false;
        backLine.receiveShadow = true;
        this.add(backLine);

        let backLineDeco = new THREE.Mesh(backLineGeometry, centerLineMaterial);
        backLineDeco.position.x = 0;
        backLineDeco.position.y = 0.0002;
        backLineDeco.position.z = -backline;
        backLineDeco.rotation.x = -Math.PI / 2;
        backLineDeco.castShadow = false;
        backLineDeco.receiveShadow = true;
        this.add(backLineDeco);


        let teeLine = new THREE.Mesh(backLineGeometry, centerLineMaterial);
        teeLine.position.x = 0;
        teeLine.position.y = 0.0002;
        teeLine.position.z = teeline;
        teeLine.rotation.x = -Math.PI / 2;
        teeLine.castShadow = false;
        teeLine.receiveShadow = true;
        this.add(teeLine);

        let teeLineDeco = new THREE.Mesh(backLineGeometry, centerLineMaterial);
        teeLineDeco.position.x = 0;
        teeLineDeco.position.y = 0.0002;
        teeLineDeco.position.z = -teeline;
        teeLineDeco.rotation.x = -Math.PI / 2;
        teeLineDeco.castShadow = false;
        teeLineDeco.receiveShadow = true;
        this.add(teeLineDeco);
    }
}

export interface ISurfaceSetup {
    length: number;
    width: number;
    height: number;
}

export interface IRingSetup {
    center: number;
    inner: number;
    middle: number;
    outer: number;
    offset: number;
}

export interface ILineSetup {
    hog: number;
    back: number;
    start: number;
}
