import { Injectable } from '@angular/core';
import { CurlingStone } from '../entities/curlingStone';
import { Rink } from '../entities/rink';

@Injectable()
export class PhysicsManager {
    // Everything is in meters, meters per second, and m/s²
    readonly GRAVITY = 9.81;
    //TODO Add properties for rink friction and stone weight, add to respective classes

    constructor() {
        //TODO: Make constructor related calls (create Curling stones?)

    }

    update(): void {
        //TODO: Add physics logic to calculate stone position, friction, etc.
        //TODO: Call update() in renderer game loop
    }

}
