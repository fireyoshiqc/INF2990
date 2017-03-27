/**
 * sceneBuilder.service.ts
 *
 * @authors Félix Boulet
 * @date 2017/03/26
 */

import { Rink, IRingSetup, ILineSetup } from '../entities/rink';
import { SkyBox } from '../entities/skybox';
import { CurlingStone, Team } from '../entities/curlingStone';

export class SceneBuilder {

    private static instance: SceneBuilder = new SceneBuilder();

    private readonly X_SPOTLIGHTS = 2;
    private readonly Z_SPOTLIGHTS = 6;
    private readonly SPOTLIGHT_HEIGHT = 5;
    private readonly SUN_COLOR = 0xccccff;
    private readonly SHADOW_COLOR = 0x000077;
    private readonly SUN_INTENSITY = 1.0;
    private readonly SHADOW_MAPSIZE = 1024;

    private activeStone: CurlingStone;
    private curlingStones: Array<CurlingStone> = [];
    private rink: Rink;

    public static getInstance(): SceneBuilder {
        return SceneBuilder.instance;
    }

    constructor() {
        if (SceneBuilder.instance) {
            throw new Error("Error: SceneBuilder is a singleton class, use SceneBuilder.getInstance() instead of new.");
        }
        SceneBuilder.instance = this;
    }

    public async buildScene(): Promise<THREE.Scene> {
        // TODO: Build rink, add lighting and camera, add stones
        let buildPromise = new Promise<THREE.Scene>((resolve, reject) => {
            const scene = new THREE.Scene();
            const skybox = new SkyBox();
            scene.add(skybox);
            this.rink = this.buildRink(skybox);
            scene.add(this.rink);
            const light = this.buildLighting(this.rink);
            scene.add(light);

            // TODO: Get rid of this when game states are properly implemented
            this.activeStone = new CurlingStone(Team.Player, new THREE.Vector3(0, 0, 2), new THREE.Vector3(0, 0, 2));
            this.curlingStones.push(this.activeStone);
            scene.add(this.activeStone);
            resolve(scene);
        });
        return buildPromise;
    }

    public getRinkData(): IRinkData {
        return { lines: this.rink.getRefLineSetup(), rings: this.rink.getRefRingSetup() };
    }

    public getSceneData(): ISceneData {
        return { activeStone: this.activeStone, curlingStones: this.curlingStones, rink: this.rink };
    }

    private buildRink(skybox: SkyBox): Rink {
        const rink = new Rink(skybox.getSkyBoxImages());
        rink.position.z = rink.getDimensions().length / 2;
        rink.position.y = -0.0775;
        rink.name = "rink";
        rink.castShadow = false;
        rink.receiveShadow = true;
        return rink;
    }

    private buildLighting(rink: Rink): THREE.Group {
        const lighting = new THREE.Group();
        lighting.add(this.spawnSpotlights(rink.getDimensions().width, rink.getDimensions().length));
        lighting.add(this.spawnSunlight());
        return lighting;
    }

    private spawnSpotlights(width: number, length: number): THREE.Group {
        const spotlightArray = new THREE.Group();
        for (let i = 0; i < this.Z_SPOTLIGHTS; i++) {
            for (let j = 0; j < this.X_SPOTLIGHTS; j++) {
                let light = new THREE.SpotLight(0xffffff, 3.5);
                light.position.set(-width / 2 + (width / (this.X_SPOTLIGHTS - 1)) * j,
                    this.SPOTLIGHT_HEIGHT, i * (length / (this.Z_SPOTLIGHTS - 1)));
                light.penumbra = 0.4;
                light.decay = 2.0;
                light.castShadow = true;
                light.shadow.mapSize.width = this.SHADOW_MAPSIZE; // 2048 or 4096 looks best but it's GPU-heavy
                light.shadow.mapSize.height = this.SHADOW_MAPSIZE; // 2048 or 4096 looks best but it's GPU-heavy
                // Cast to PerspectiveCamera since Camera doesn't have far property... thanks TypeScript.
                (<THREE.PerspectiveCamera>light.shadow.camera).far = 20;
                spotlightArray.add(light);

                let lightTarget = new THREE.Object3D();
                lightTarget.position.set(light.position.x, 0, light.position.z);
                spotlightArray.add(lightTarget);
                light.target = lightTarget;
            }
        }
        return spotlightArray;
    }

    private spawnSunlight(): THREE.HemisphereLight {
        return new THREE.HemisphereLight(this.SUN_COLOR, this.SHADOW_COLOR, this.SUN_INTENSITY);
    }
}

export interface ISceneData {
    activeStone: CurlingStone;
    curlingStones: Array<CurlingStone>;
    rink: Rink;
}

export interface IRinkData {
    lines: ILineSetup;
    rings: IRingSetup;
}
