
/**
 * lightManager.ts - Controls the light on the scene
 *
 * @authors Félix Boulet et Yawen Hou
 * @date 2017/01/27
 */

import { Rink } from '../entities/rink';

export class LightManager {

    spawnSpotlights(posX : number, posY : number, posZ : number, rink : Rink) : SpotlightArray {
        let spotlights = new SpotlightArray(rink.RINK_WIDTH, rink.RINK_LENGTH, 2, 6);
        spotlights.position.x = posX;
        spotlights.position.y = posY;
        spotlights.position.z = posZ;
        return spotlights;
    }

    spawnAmbientLight(sunColor : number, shadowColor : number) : THREE.HemisphereLight {
        let ambilight = new THREE.HemisphereLight(sunColor, shadowColor, 1.0);
        return ambilight;
    }
}

class SpotlightArray extends THREE.Group {
    constructor(width : number, length : number, wLights : number, lLights : number, target ?: THREE.Object3D) {
        super();

        for (let i = 0; i < lLights; i++) {
            for (let j = 0; j < wLights; j++) {
                let sunlight = new THREE.SpotLight(0xffffff, 0.6);
                sunlight.position.set((width / (wLights - 1)) * j, 5, -i * (length / (lLights - 1)));
                sunlight.penumbra = 0.4;
                this.add(sunlight);

                if (target !== undefined) {
                    this.add(target);
                    sunlight.target = target;
                }
                else {
                    let lightTarget = new THREE.Object3D();
                    lightTarget.position.set((width / (wLights - 1)) * j, 0, -i * (length / (lLights - 1)));
                    this.add(lightTarget);
                    sunlight.target = lightTarget;
                }
            }
        }
    }
}
