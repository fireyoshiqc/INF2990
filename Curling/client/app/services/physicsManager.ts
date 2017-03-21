import { Injectable } from '@angular/core';
import { CurlingStone } from '../entities/curlingStone';
import { Rink } from '../entities/rink';

@Injectable()
export class PhysicsManager {

    // Everything is in meters, meters per second, and m/s²
    // TODO use weight directly instead of mass?
    private readonly GRAVITY_N_PER_KG = 9.81;
    private readonly COEFFICIENT_OF_FRICTION = 0.0168;
    private readonly FRICTION_MAGNITUDE = this.GRAVITY_N_PER_KG * this.COEFFICIENT_OF_FRICTION;
    private readonly CURVE_ANGLE = Math.PI / 300;
    private curlingStones: CurlingStone[] = [];
    private sweptSpots: ISweptSpot[] = [];
    private decayedSpots: ISweptSpot[] = [];
    private delta: number;

    constructor(curlingStones: CurlingStone[]) {
        this.curlingStones = curlingStones;
    }

    public clearStones() {
        this.curlingStones.splice(0, this.curlingStones.length);
    }

    public getStones(): Array<CurlingStone> {
        return this.curlingStones;
    }

    public update(delta: number): void {
        this.delta = delta;

        // Collision
        this.updateCollidingStonesDirection();
        this.updateAllStonesPosition();
    }

    private updateCollidingStonesDirection(): void {
        for (let i = 0; i < this.curlingStones.length; i++) {
            for (let j = i + 1; j < this.curlingStones.length; j++) {
                let vec = this.calculateVectorLinkingBothStones(i, j);

                if (vec.length() !== 0 && vec.length() < CurlingStone.MAX_RADIUS * 2) {
                    this.calculateCollision(i, j, vec);
                    this.separateStones(i, j);
                }
            }
        }
    }

    private calculateCollision(idStone1: number, idStone2: number, normalCollisionPlane: THREE.Vector3) {
        let speedStonei = this.curlingStones[idStone1].getVelocity().clone();
        let speedStonej = this.curlingStones[idStone2].getVelocity().clone();

        // Use vector calculations to determine the velocity of each stone
        // On the tangent and normal axis to the collision plane.
        let normali = speedStonei.clone().projectOnVector(normalCollisionPlane);
        let normalj = speedStonej.clone().projectOnVector(normalCollisionPlane);
        let tangenti = speedStonei.clone().sub(normali);
        let tangentj = speedStonej.clone().sub(normalj);
        this.curlingStones[idStone1].setVelocity(tangenti.clone().add(normalj));
        this.curlingStones[idStone2].setVelocity(tangentj.clone().add(normali));
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

    private updateAllStonesPosition(): void {
        this.curlingStones.forEach(stone => {
            this.updateCurlingStonePosition(stone);
        });
    }

    private updateCurlingStonePosition(stone: CurlingStone, separationCorrection?: number) {
        if (separationCorrection === undefined) {

            let multiplier: number;

            this.checkforSweptSpots(stone) ? multiplier = 0.2 : multiplier = 1.5;

            if (stone.isBeingPlayed()) {
                // Curve calculation only for the stone that was thrown
                let curvedVelocity = stone.getVelocity().clone();
                let curveFactor = multiplier / 1.5 * this.delta * stone.getSpinOrientation() * this.CURVE_ANGLE;
                curvedVelocity.x = Math.cos(curveFactor) * stone.getVelocity().x
                    + Math.sin(curveFactor) * stone.getVelocity().z;
                curvedVelocity.z = -Math.sin(curveFactor) * stone.getVelocity().x
                    + Math.cos(curveFactor) * stone.getVelocity().z;
                stone.setVelocity(curvedVelocity.clone());
            }

            stone.getVelocity().sub((stone.getVelocity().clone().normalize()
                .multiplyScalar(multiplier * this.FRICTION_MAGNITUDE * this.delta)));
            stone.position.add((stone.getVelocity().clone().multiplyScalar(this.delta)));

        }
        else {
            // For stone separation
            stone.position.add(stone.getVelocity().clone().multiplyScalar(separationCorrection * this.delta));
        }
    }

    private checkforSweptSpots(stone: CurlingStone): boolean {
        let isOverSpot = false;
        let spotsToDecay: ISweptSpot[] = [];
        for (let spot of this.sweptSpots) {
            spot.ttl -= this.delta;
            if (stone.position.clone().sub(spot.position).length() <= CurlingStone.MAX_RADIUS) {
                isOverSpot = true;
            }
            if (spot.ttl <= 0) {
                spotsToDecay.push(spot);
            }
        }
        this.sweptSpots = this.sweptSpots.filter(element => spotsToDecay.indexOf(element) < 0);
        this.decayedSpots = spotsToDecay;
        return isOverSpot;
    }

    public addSweptSpot(spot: THREE.Vector3, id: number): void {
        this.sweptSpots.push({ position: spot, ttl: 1.0, id });
    }

    public getDecayedSpots(): ISweptSpot[] {
        return this.decayedSpots;
    }

    public cleanDecayedSpots(): void {
        this.decayedSpots = [];
    }

    public getOutOfBoundsStones(): CurlingStone[] {
        let outOfBoundsStones: CurlingStone[] = [];

        this.curlingStones.forEach(stone => {
            if (stone.getHasBeenShot()) {
                let isPastBackLine = stone.position.z < -(Rink.RINK_LENGTH + CurlingStone.MAX_RADIUS);
                let isPastRinkSides = Math.abs(stone.position.x) > (Rink.RINK_WIDTH / 2 - CurlingStone.MAX_RADIUS);
                let hasStoppedBeforeGameLine = stone.getVelocity().length() < 0.01 &&
                                              (stone.position.z > Rink.HOG_LINE);

                if (isPastBackLine || isPastRinkSides || hasStoppedBeforeGameLine) {
                    outOfBoundsStones.push(stone);
                }
            }
        });

        return outOfBoundsStones;
    }

    public sortStonesByDistance(): void {
        if (this.curlingStones.length > 1) {
            this.curlingStones.sort((stone1: CurlingStone, stone2: CurlingStone) => {
                // If stone1 is closer to the rings than stone 2, it should be placed before stone 2
                return stone1.position.distanceTo(Rink.RINGS_CENTER) - stone2.position.distanceTo(Rink.RINGS_CENTER);
            });
        }
    }

    public allStonesHaveStopped(): boolean {
        let allStonesHaveStopped = true;

        this.curlingStones.forEach(stone => {
            if (stone.getVelocity().length() > 0.01) {
                allStonesHaveStopped = false;
            }
        });

        return allStonesHaveStopped;
    }

    /******************** TEST HELPER *******************/

    public setStonesForOutOfBoundsTests(): void {
        this.clearStones();

        let speed = new THREE.Vector3(0, 0, 0);

        // Past left boundary
        let leftPos = new THREE.Vector3(-(Rink.RINK_WIDTH / 2 - CurlingStone.MAX_RADIUS) - 0.1, 0, 0);
        this.curlingStones.push(new CurlingStone(null, speed, leftPos));

        // Past right boundary
        let rightPos = new THREE.Vector3((Rink.RINK_WIDTH / 2 - CurlingStone.MAX_RADIUS) + 0.1, 0, 0);
        this.curlingStones.push(new CurlingStone(null, speed, rightPos));

        // Past back line
        let backPos = new THREE.Vector3(0, 0, -(Rink.RINK_LENGTH + CurlingStone.MAX_RADIUS) - 0.1);
        this.curlingStones.push(new CurlingStone(null, speed, backPos));

        // Stopped before game line
        this.curlingStones.push(new CurlingStone(null, speed, new THREE.Vector3(0, 0, 0)));
    }

    /***************** END TEST HELPER *******************/
}

interface ISweptSpot {
    position: THREE.Vector3;
    ttl: number;
    id: number;
}
