/**
 * physicsManager.service.ts Handles curling stone and ice physics. Also plays sounds.
 *
 * @authors Mikaël Ferland, Yawen Hou
 * @modified Félix Boulet, Mikaël Ferland
 * @date 2017/04/01
 */

import { Injectable } from '@angular/core';
import { CurlingStone, Team, SpinOrientation } from '../entities/curlingStone';
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
    private readonly MULTIPLIER_NORMAL_ICE = 1.5;
    private readonly MULTIPLIER_FAST_ICE = 0.2;

    // Constants for velocity estimation used for AI throws
    private readonly ACCELERATION_NORMAL_ICE = this.FRICTION_MAGNITUDE * this.MULTIPLIER_NORMAL_ICE;
    private readonly ESTIMATED_TIME_DELTA = 1 / 30;
    private readonly X_VELOCITY_DELTA = 0.001;

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
        let stone: CurlingStone;

        if (this.curlingStones[idStone1].getVelocity().length >= this.curlingStones[idStone2].getVelocity().length) {
            stone = this.curlingStones[idStone1];
        } else {
            stone = this.curlingStones[idStone2];
        }

        let collisionSound = <THREE.PositionalAudio>(stone.getObjectByName("collisionSound"));

        if (collisionSound !== undefined) {
            collisionSound.setVolume(2.0);

            if (collisionSound.isPlaying) {
                collisionSound.stop();
            }
            collisionSound.play();
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
            multiplier = this.checkforFastIceSpots(stone) ? this.MULTIPLIER_FAST_ICE : this.MULTIPLIER_NORMAL_ICE;

            this.calculateCurlingStonePosition(stone, multiplier, this.delta);

            const slidingSound = <THREE.PositionalAudio>(stone.getObjectByName("slidingSound"));

            if (slidingSound !== undefined) {
                if (stone.getVelocity().length() > 0.01) {
                    slidingSound.setVolume(stone.getVelocity().length() / 3);
                    if (!slidingSound.isPlaying) {
                        slidingSound.play();
                    }
                } else {
                    if (slidingSound.isPlaying) {
                        slidingSound.stop();
                    }
                }
            }
        }
        else {
            // For stone separation
            stone.position.add(stone.getVelocity().clone().multiplyScalar(separationCorrection * this.delta));
        }
    }

    private calculateCurlingStonePosition(stone: CurlingStone, multiplier: number, delta: number): void {
        if (stone.isBeingPlayed()) {
            // Curve calculation only for the stone that was thrown
            let curvedVelocity = stone.getVelocity().clone();
            let curveFactor = multiplier / 1.5 * delta * stone.getSpinOrientation() * this.CURVE_ANGLE;

            curvedVelocity.x = Math.cos(curveFactor) * stone.getVelocity().x
                + Math.sin(curveFactor) * stone.getVelocity().z;
            curvedVelocity.z = -Math.sin(curveFactor) * stone.getVelocity().x
                + Math.cos(curveFactor) * stone.getVelocity().z;

            stone.setVelocity(curvedVelocity.clone());
        }

        stone.getVelocity().sub((stone.getVelocity().clone().normalize()
            .multiplyScalar(multiplier * this.FRICTION_MAGNITUDE * delta)));
        stone.update(delta);
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
                        if (slidingSound !== undefined && slidingSound.isPlaying) {
                            slidingSound.stop();
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

    public getTeamStoneWithinDistance(team: Team, distance: Number): CurlingStone {
        let ringsCenterPosition = new THREE.Vector3(0, 0, SceneBuilder.getInstance().getRinkData().rings.offset);
        this.sortStonesByDistance();
        let redRingBackPositionZ = SceneBuilder.getInstance().getRinkData().rings.offset +
            SceneBuilder.getInstance().getRinkData().rings.inner;
        // PhysicsManager contains stones in game sorted by distance to the center of the rings
        return this.curlingStones.find(stone => (
            stone.getTeam() === team &&
            stone.position.z < redRingBackPositionZ &&
            stone.position.distanceTo(ringsCenterPosition) <= distance
        ));
    }

    public findStoneAtPosition(position: THREE.Vector3): CurlingStone {
        for (let index = 0; index < this.curlingStones.length; index++) {
            // Only checks for stones that are after the hogline
            let stone = this.curlingStones[index];
            if (stone.position.z > SceneBuilder.getInstance().getRinkData().lines.hog &&
                stone.position.distanceTo(position) <= CurlingStone.MAX_DIAMETER) {
                return stone;
            }
        }
        return undefined;
    }

    // Look for an obstacle stone in the predetermined trajectory
    public findObstacleStone(dummyStone: CurlingStone, finalPosition: THREE.Vector3): CurlingStone {

        while (dummyStone.position.z < finalPosition.z - 3 * CurlingStone.MAX_RADIUS) {
            this.calculateCurlingStonePosition(dummyStone, this.MULTIPLIER_NORMAL_ICE, this.ESTIMATED_TIME_DELTA);
            let obstacleStone = this.findStoneAtPosition(dummyStone.position.clone());

            if (obstacleStone !== undefined) {
                return obstacleStone;
            }
        }
        return undefined;
    }

    // Finds the initial velocity of an AI curling stone in order to get to a specific position with a z velocity
    public getVelocityToPosition(finalPosition: THREE.Vector3, finalVelocityZ: number,
                                                               spin: SpinOrientation): THREE.Vector3 {
        let tmpStone = new CurlingStone(Team.AI, new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, SceneBuilder.getInstance().getRinkData().lines.start));
        tmpStone.setSpinOrientation(spin);

        // Calculate the initial z velocity to get to the z position
        let initialVelocityZ = this.getZVelocityToPosition(finalPosition, finalVelocityZ, tmpStone);
        tmpStone.setVelocity(new THREE.Vector3(0, 0, initialVelocityZ));

        // Calculate the initial x velocity to get to the position
        let initialVelocityX = this.getXVelocityToPosition(finalPosition, finalVelocityZ, tmpStone);
        tmpStone.setVelocity(new THREE.Vector3(initialVelocityX, 0, initialVelocityZ));

        return tmpStone.getVelocity().clone();
    }

    private getZVelocityToPosition(finalPosition: THREE.Vector3, finalVelocityZ: number, stone: CurlingStone): number {
        let initialPositionZ = SceneBuilder.getInstance().getRinkData().lines.start;
        let zDistance = finalPosition.z - initialPositionZ;

        // Formula : velocityI = sqrt (velocityF^2 - 2 * acceleration * (zPositionF - zPositionI))
        let initialVelocityZ = Math.sqrt(Math.pow(finalVelocityZ, 2) + (2 * this.ACCELERATION_NORMAL_ICE * zDistance));

        return initialVelocityZ;
    }

    private getXVelocityToPosition(finalPosition: THREE.Vector3, finalVelocityZ: number, stone: CurlingStone): number {
        // Estimate the time required for the curling stone to get to the z position
        // Formula : time = |(velocityF - velocity I) / acceleration|
        let finalPositionError = CurlingStone.MAX_RADIUS;
        let estimatedInitialVelocity = stone.getVelocity().clone();
        // Keep a copy of the initial velocity for reseting the stone's velocity when enters in a infinite loop
        let estimatedInitialVelocityClone = estimatedInitialVelocity.clone();
        const estimatedTime = Math.abs((finalVelocityZ - estimatedInitialVelocity.z) / this.ACCELERATION_NORMAL_ICE);

        // Iteration process that finds the estimatedVelocity in X
        let velocityFound = false;
        while (!velocityFound) {
            // Estimate final position given an initial stone velocity
            for (let time = 0; time < estimatedTime; time += this.ESTIMATED_TIME_DELTA) {
                this.calculateCurlingStonePosition(stone, this.MULTIPLIER_NORMAL_ICE, this.ESTIMATED_TIME_DELTA);
            }

            // Return estimatedVelocity if the stone satisfies the finalPosition
            if (finalPosition.distanceTo(stone.position) < finalPositionError) {
                velocityFound = true;
                return estimatedInitialVelocity.x;
            }

            // Reset stone position
            stone.position.set(0, 0, SceneBuilder.getInstance().getRinkData().lines.start);

            // Set estimatedVelocity for next iteration (it depends on stone spin)
            estimatedInitialVelocity.x += -stone.getSpinOrientation() * this.X_VELOCITY_DELTA;
            stone.setVelocity(estimatedInitialVelocity.clone());

            // If the stone's velocity in x is absurd, grow the finalPositionError and reset the calculation parameters
            if (Math.abs(stone.getVelocity().x) > 1 && finalPositionError < CurlingStone.MAX_DIAMETER) {
                finalPositionError += CurlingStone.MAX_RADIUS;
                estimatedInitialVelocity = estimatedInitialVelocityClone.clone();
                stone.setVelocity(estimatedInitialVelocity.clone());
            }
        }
    }

    public allStonesHaveStopped(): boolean {
        let allStonesHaveStopped = true;

        this.curlingStones.forEach(stone => {
            if (stone.getVelocity().length() > 0.01 || stone.isCurrentlyFading()) {
                allStonesHaveStopped = false;
            } else {
                // Stop the stone completely
                stone.setVelocity(new THREE.Vector3(0, 0, 0));
            }
        });

        return allStonesHaveStopped;
    }
}

interface ISweptSpot {
    position: THREE.Vector3;
    id: number;
}
