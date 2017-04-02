import { Injectable } from '@angular/core';
import { CurlingStone } from '../entities/curlingStone';
import { SceneBuilder } from './sceneBuilder.service';
import { GameEngine } from './gameEngine.service';
import { FastIce } from '../entities/fastIce';

@Injectable()
export class PhysicsManager {

    // Everything is in meters, meters per second, and m/s²
    private static instance = new PhysicsManager();

    private readonly GRAVITY_N_PER_KG = 9.81;
    private readonly COEFFICIENT_OF_FRICTION = 0.0168;
    private readonly FRICTION_MAGNITUDE = this.GRAVITY_N_PER_KG * this.COEFFICIENT_OF_FRICTION;
    private readonly CURVE_ANGLE = Math.PI / 300;
    private readonly SPIN_RATIO = 2;
    private curlingStones: CurlingStone[] = [];
    private fastIceSpots: FastIce[] = [];
    private delta: number;

    public static getInstance(): PhysicsManager {
        return this.instance;
    }

    private constructor() {
        if (PhysicsManager.instance) {
            throw new Error(
                "Error: PhysicsManager is a singleton class, use PhysicsManager.getInstance() instead of new.");
        }
        PhysicsManager.instance = this;
    }

    public init(curlingStones?: Array<CurlingStone>): void {
        this.curlingStones = curlingStones ? curlingStones : GameEngine.getInstance().getStones();
        this.fastIceSpots = GameEngine.getInstance().getFastIceBuffer();
    }

    public clearStones(): void {
        this.curlingStones.splice(0, this.curlingStones.length);
    }

    public getStones(): Array<CurlingStone> {
        return this.curlingStones;
    }

    public update(delta: number): void {
        this.delta = delta;

        this.updateCollidingStonesDirection();
        this.updateAllStonesPosition();
        this.spinActiveStone();
        this.removeOutOfBoundsStones();

        // Fade spots
        this.fadeFastIceSpots(delta);
    }

    private updateCollidingStonesDirection(): void {
        for (let i = 0; i < this.curlingStones.length; i++) {
            for (let j = i + 1; j < this.curlingStones.length; j++) {
                let vec = this.calculateVectorLinkingBothStones(i, j);

                if (vec.length() !== 0 && vec.length() < CurlingStone.MAX_RADIUS * 2) {
                    this.calculateCollision(i, j, vec);
                    this.separateStones(i, j);
                    this.playCollisionSound(i, j);
                }
            }
        }
    }

    private calculateCollision(idStone1: number, idStone2: number, normalCollisionPlane: THREE.Vector3): void {
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

    private separateStones(idStone1: number, idStone2: number): void {
        do {
            this.updateCurlingStonePosition(this.curlingStones[idStone1], 0.01);
            this.updateCurlingStonePosition(this.curlingStones[idStone2], 0.01);
        } while (this.calculateVectorLinkingBothStones(idStone1, idStone2).length() < CurlingStone.MAX_RADIUS * 2);
    }

    private playCollisionSound(idStone1: number, idStone2: number): void {
        if (this.curlingStones[idStone1].getVelocity().length >= this.curlingStones[idStone2].getVelocity().length) {
            let collisionSound = <THREE.PositionalAudio>(this.curlingStones[idStone1]
                .getObjectByName("collisionSound"));
            if (collisionSound !== undefined) {
                collisionSound.setVolume(2.0);
                if (collisionSound.isPlaying) {
                    collisionSound.stop();
                }
                collisionSound.play();
            }
        } else {
            let collisionSound = <THREE.PositionalAudio>(this.curlingStones[idStone2]
                .getObjectByName("collisionSound"));
            if (collisionSound !== undefined) {
                collisionSound.setVolume(2.0);
                if (collisionSound.isPlaying) {
                    collisionSound.stop();
                }
                collisionSound.play();
            }
        }
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

    private updateCurlingStonePosition(stone: CurlingStone, separationCorrection?: number): void {
        if (separationCorrection === undefined) {

            let multiplier: number;
            this.checkforFastIceSpots(stone) ? multiplier = 0.2 : multiplier = 1.5;

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
            stone.update(this.delta);

            const slidingSound = <THREE.PositionalAudio>(stone.getObjectByName("slidingSound"));

            if (slidingSound !== undefined) {
                if (stone.getVelocity().length() > 0.01) {
                    slidingSound.setVolume(stone.getVelocity().length() / 3);
                    if (!slidingSound.isPlaying) {
                        slidingSound.play();
                    }
                } else {
                    slidingSound.stop();
                }
            }
        }
        else {
            // For stone separation
            stone.position.add(stone.getVelocity().clone().multiplyScalar(separationCorrection * this.delta));
        }
    }

    private spinActiveStone(): void {
        let stone = GameEngine.getInstance().getActiveStone();

        if (stone !== undefined && stone.getVelocity().length() > 0.1) {
            stone.rotateY(stone.getSpinOrientation() * this.delta * stone.getVelocity().length() / this.SPIN_RATIO);
        }
    }

    // Make the swept ice spots fade
    private fadeFastIceSpots(delta: number): void {

        let i = this.fastIceSpots.length;

        while (i--) {
            if (this.fastIceSpots[i].fadeOut(delta)) {
                GameEngine.getInstance().removeFromScene(this.fastIceSpots[i]);
                this.fastIceSpots.splice(i, 1);
            }
        }
    }

    // }

    //  Check if active stone if over a swept ice spot, to change its friction and spin influence
    private checkforFastIceSpots(stone: CurlingStone): boolean {

        let isOverSpot = false;

        this.fastIceSpots.forEach((spot) => {
            if (stone.position.clone().sub(spot.position).length() <= CurlingStone.MAX_RADIUS) {
                isOverSpot = true;
            }
        });

        return isOverSpot;
    }

    // Can't be tested since it absolutely needs the GameEngine singleton running.
    public cleanFastIceSpots(): void {
        this.fastIceSpots.forEach((spot) => {
            GameEngine.getInstance().removeFromScene(spot);
        });
        this.fastIceSpots.splice(0);
    }

    private removeOutOfBoundsStones(): void {

        let i = this.curlingStones.length;

        while (i--) {

            if (this.curlingStones[i].getHasBeenShot()) {
                const rink = SceneBuilder.getInstance().getRinkData();
                let isPastBackLine = this.curlingStones[i].position.z > rink.lines.back;
                let isPastRinkSides = Math.abs(this.curlingStones[i].position.x)
                    > (rink.dims.width / 2 - CurlingStone.MAX_RADIUS);
                let hasStoppedBeforeGameLine = this.curlingStones[i].getVelocity().length() < 0.01 &&
                    (this.curlingStones[i].position.z < rink.lines.hog + CurlingStone.MAX_RADIUS &&
                        this.curlingStones[i].isBeingPlayed);

                if (isPastBackLine || isPastRinkSides || hasStoppedBeforeGameLine) {
                    if (this.curlingStones[i].fadeOut(this.delta)) {
                        const slidingSound = <THREE.PositionalAudio>(this.curlingStones[i]
                            .getObjectByName("slidingSound"));
                        if (slidingSound !== undefined) {
                            if (slidingSound.isPlaying) {
                                slidingSound.stop();
                            }
                        }
                        GameEngine.getInstance().removeFromScene(this.curlingStones[i]);
                        this.curlingStones.splice(i, 1);
                    }
                }
            }
        }
    }

    public sortStonesByDistance(center?: THREE.Vector3): void {
        if (this.curlingStones.length > 1) {
            let offset: number;
            let centerVector: THREE.Vector3;

            // Normal behaviour
            if (center === undefined) {
                offset = SceneBuilder.getInstance().getRinkData().rings.offset;
                centerVector = new THREE.Vector3(0, 0, offset);
            } else {
                // For tests
                centerVector = center;
            }
            this.curlingStones.sort((stone1: CurlingStone, stone2: CurlingStone) => {
                // If stone1 is closer to the rings than stone 2, it should be placed before stone 2
                return stone1.position.distanceTo(centerVector) - stone2.position.distanceTo(centerVector);
            });
        }
    }

    public allStonesHaveStopped(): boolean {
        let allStonesHaveStopped = true;

        this.curlingStones.forEach(stone => {
            if (stone.getVelocity().length() > 0.01 || stone.isCurrentlyFading()) {
                allStonesHaveStopped = false;
            }
        });

        return allStonesHaveStopped;
    }
}

interface ISweptSpot {
    position: THREE.Vector3;
    id: number;
}
