/**
 * sceneBuilder.service.ts
 *
 * @authors Félix Boulet
 * @date 2017/03/26
 */

export class SceneBuilder {
    private static instance: SceneBuilder = new SceneBuilder();
    private scene: THREE.Scene;

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

        });
        return buildPromise;
    }
}