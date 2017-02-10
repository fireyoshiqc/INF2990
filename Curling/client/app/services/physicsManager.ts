import { Injectable } from '@angular/core';
import { CurlingStone } from '../entities/curlingStone';

@Injectable()
export class PhysicsManager {

    // Everything is in meters, meters per second, and m/s²
    readonly GRAVITY = 9.81;
    private curlingStones: CurlingStone[] = new Array();
    private delta: number;
    //TODO Add properties for rink friction and stone weight, add to respective classes

    constructor() {
        //TODO: Make constructor related calls (create Curling stones?)
        this.curlingStones = new Array() as Array<CurlingStone>;
    }

    add(curlingStone: CurlingStone) {
        this.curlingStones.push(curlingStone);
    }

    getStones(): Array<CurlingStone> {
        return this.curlingStones;
    }

    update(delta: number): void {
        this.delta = delta;
        //TODO: Add physics logic to calculate stone position, friction, etc.
        //TODO: Call update() in renderer game loop
        //TODO: Collision detection should be called here instead of GameRenderer
    }

    detectCollision(): void {
        this.updateDirection();
        this.updateAllStonesPosition(0.5);
    }

    private updateDirection(): void {
        for (let i = 0; i < this.curlingStones.length; i++) {
            for (let j = i + 1; j < this.curlingStones.length; j++) {
                let vec = this.calculateVectorLinkingBothStones(i, j);

                if (vec.length() !== 0 && vec.length() < CurlingStone.MAX_RADIUS * 2) {
                    let speedStonei = this.curlingStones[i].direction.clone();
                    let speedStonej = this.curlingStones[j].direction.clone();

                    let curlingStoneWeight = this.curlingStones[i].getCurlingStoneWeight();
                    let momentum = (speedStonei.clone().dot(vec) - speedStonej.clone().dot(vec)) / curlingStoneWeight;
                    let nij = (vec.clone().multiplyScalar(momentum * curlingStoneWeight)).normalize();

                    this.curlingStones[i].direction = (speedStonei.clone().sub(nij)).normalize();
                    this.curlingStones[j].direction = (speedStonej.clone().add(nij)).normalize();

                    this.separateStones(i, j);
                }
            }
        }
    }

    private separateStones(idStone1: number, idStone2: number) {
        do {
            this.updateCurlingStonePosition(this.curlingStones[idStone1], 0.01);
            this.updateCurlingStonePosition(this.curlingStones[idStone2], 0.01);
        } while (this.calculateVectorLinkingBothStones(idStone1, idStone2).length() < CurlingStone.MAX_RADIUS * 2);
    }

    // Calculate the vector from the center of the first circle and the center of the second circle
    private calculateVectorLinkingBothStones(idStone1: number, idStone2: number): THREE.Vector3 {
        return this.curlingStones[idStone1].position.clone().sub(this.curlingStones[idStone2].position);
    }

    private updateAllStonesPosition(speed: number): void {
        this.curlingStones.forEach(stone => {
           this.updateCurlingStonePosition(stone, speed);
        });
    }

    private updateCurlingStonePosition(stone: CurlingStone, speed: number) {
        stone.position.add(stone.direction.clone().multiplyScalar(speed * this.delta));
    }
}
