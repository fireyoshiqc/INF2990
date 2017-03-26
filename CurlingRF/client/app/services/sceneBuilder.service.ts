/**
 * sceneBuilder.service.ts
 *
 * @authors Félix Boulet
 * @date 2017/03/26
 */

import { Rink } from '../entities/rink';
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
            skybox.name = "skybox";
            scene.add(skybox);
            const rink = this.buildRink(skybox);
            scene.add(rink);
            const light = this.buildLighting(rink);
            scene.add(light);
            const stone = new CurlingStone(Team.Player, new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 2));
            // TODO: Remove this once physics are re-implemented.
            stone.name = "teststone";
            scene.add(stone);
            resolve(scene);
        });
        return buildPromise;
    }

    private buildRink(skybox: SkyBox): Rink {
        const rink = new Rink(skybox.getSkyBoxImages());
        rink.position.z = rink.getDimensions().length / 2;
        rink.position.y = -0.0775;
        rink.name = "rink";
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
