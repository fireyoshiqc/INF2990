/**
 * gameController.service.ts
 *
 * @authors Vincent Chassé et Pierre To
 * @date 2017/02/24
 */

import { Injectable } from '@angular/core';

import { CurlingStone } from '../entities/curlingStone';
import { GameRenderer } from './gameRenderer';

@Injectable()
export class GameController {
    // TODO: Remove when experimental tests are done
    readonly RINK_LENGTH = 46;

    private gameRenderer: GameRenderer;
    private curlingStones: CurlingStone[] = [];

    public init(container?: HTMLElement): void {
        this.gameRenderer = new GameRenderer();

        this.gameRenderer.init(container);

        // ----- Experimental : Adding 7 stones to test the collision ------- //
        let stone1 = new CurlingStone(new THREE.Vector3(0.2, 0, -5),
            new THREE.Vector3(0, 0, 0));
        stone1.init();
        stone1.isBeingPlayed = true;
        this.curlingStones.push(stone1);

        let stone2 = new CurlingStone(new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -this.RINK_LENGTH / 2));
        stone2.init();
        this.curlingStones.push(stone2);

        let stone3 = new CurlingStone(new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.6, 0, -this.RINK_LENGTH / 2 - 0.5));
        stone3.init();
        this.curlingStones.push(stone3);

        let stone4 = new CurlingStone(new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.6, 0, -this.RINK_LENGTH / 2 - 1.2));
        stone4.init();
        this.curlingStones.push(stone4);

        let stone5 = new CurlingStone(new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(-0.5, 0, -this.RINK_LENGTH / 2 - 0.5));
        stone5.init();
        this.curlingStones.push(stone5);

        let stone6 = new CurlingStone(new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -this.RINK_LENGTH / 2 - 0.9));
        stone6.init();
        this.curlingStones.push(stone6);

        let stone7 = new CurlingStone(new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.1, 0, -this.RINK_LENGTH / 2 - 3));
        stone7.init();
        this.curlingStones.push(stone7);

        let stone8 = new CurlingStone(new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(-2, 0, -this.RINK_LENGTH / 2));
        stone8.init();
        this.curlingStones.push(stone8);

        let stone9 = new CurlingStone(new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(2, 0, -this.RINK_LENGTH / 2 - 1));
        stone9.init();
        this.curlingStones.push(stone9);

        // -------------------END Experiment -------------------------------- //

        this.gameRenderer.setStones(this.curlingStones);

        this.gameRenderer.render();
    }

    getCurlingStones(): CurlingStone[] {
        return this.curlingStones;
    }

    onResize(event: any): void {
        this.gameRenderer.onResize(event);
    }

    switchCamera(): void {
        this.gameRenderer.switchCamera();
    }
}
