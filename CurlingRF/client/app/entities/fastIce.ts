/**
 * fastIce.ts - Refactor of the sweptSpots of original curling
 *
 * @authors Félix Boulet (et Yawen Hou à l'origine)
 * @date 2017/03/31
 */

import { CurlingStone } from './curlingStone';
import { Rink } from './rink';

export class FastIce extends THREE.Object3D {

    public constructor(rink: Rink) {
        super();
        this.init(rink);
    }

    private init(rink: Rink): void {
        const sweptDiscGeometry: THREE.Geometry = new THREE.CircleGeometry(CurlingStone.MAX_RADIUS, 20);
        const discMaterial: THREE.Material = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            metalness: 0.8,
            roughness: 0.0,
            envMap: rink.getReflectTexture(),
            envMapIntensity: 1.0,
            map: rink.getWhiteIceTexture(),
        });
        discMaterial.clippingPlanes = rink.getClippingPlanes();
        let disc: THREE.Mesh = new THREE.Mesh(sweptDiscGeometry, discMaterial);
        disc.position.y = 0.00005;
        disc.position.z = 50;
        disc.rotation.x = -Math.PI / 2;
        this.add(disc);
    }

}