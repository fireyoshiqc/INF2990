import { Injectable } from '@angular/core';
import { CurlingStone } from '../entities/curlingStone';

@Injectable()
export class PhysicsManager {

    // Everything is in meters, meters per second, and m/s²
    readonly GRAVITY = 9.81;
    private curlingStones: CurlingStone[] = new Array();
    clock: THREE.Clock;
    //TODO Add properties for rink friction and stone weight, add to respective classes

    constructor() {
        //TODO: Make constructor related calls (create Curling stones?)
        this.curlingStones = new Array() as Array<CurlingStone>;
        this.clock = new THREE.Clock();
    }

    add(curlingStone: CurlingStone) {
        this.curlingStones.push(curlingStone);
    }

    get(): Array<CurlingStone> {
        return this.curlingStones;
    }

    update(): void {
        //TODO: Add physics logic to calculate stone position, friction, etc.
        //TODO: Call update() in renderer game loop
    }

    detectCollision(): void {
      this.updateDirection();
      this.updatePosition();
    }

     updateDirection(): void {
        for (let i = 0; i < this.curlingStones.length; i++) {
            for (let j = i + 1; j < this.curlingStones.length; j++) {
                // Calculate vector linking both curling stones
                let vec = this.curlingStones[i].position.clone().sub(this.curlingStones[j].position);

                if (vec.length() !== 0 && vec.length() < CurlingStone.RADIUS * 4) {
                    let newDirVec1 = vec.clone().normalize();
                    let newDirVec2 = vec.clone().normalize().negate();
                    this.curlingStones[i].direction = (newDirVec1.add(this.curlingStones[i].direction)).normalize();
                    this.curlingStones[j].direction = (newDirVec2.add(this.curlingStones[j].direction)).normalize();
                }
            }
        }
    }

    updatePosition(): void {
        let delta = this.clock.getDelta();
        this.curlingStones.forEach(stone => {
             stone.position.add(stone.direction.clone().multiplyScalar(0.5 * delta));
        });
    }

}
