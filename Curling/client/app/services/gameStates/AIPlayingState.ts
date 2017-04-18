/**
 * AIPlayingState.ts
 *
 * @authors Vincent Chassé, Pierre To, Yawen Hou
 * @date 2017/04/04
 */

import { IGameState } from './GameState';
import { EndThrowState } from './EndThrowState';
import { GameController, AIDifficulty } from '../gameController.service';
import { GameEngine } from '../gameEngine.service';
import { PhysicsManager } from '../physicsManager.service';
import { SceneBuilder } from '../sceneBuilder.service';
import { CurlingStone, Team, SpinOrientation } from '../../entities/curlingStone';

// -------------------- HELPER FUNCTIONS -------------------------- //

export function getRandomFloat(min: number, max: number): number {
    return (Math.random() * (max - min)) + min;
}

// -------------------- END HELPER FUNCTIONS ----------------------- //

export class AIPlayingState implements IGameState {
    private static instance: AIPlayingState = new AIPlayingState();
    private readonly THROW_DELAY_MS = 1000;
    private readonly NORMAL_FAILED_FACTOR = 0.67;
    private readonly X_FAILED_MAX_VELOCITY = 0.5;
    private readonly X_SUCCESS_MAX_VELOCITY = 0.45;
    private readonly X_HOUSE_CENTER_VELOCITY = 0.27;
    private readonly Z_FRONT_HOGLINE_VELOCITY = 2.15353;
    private readonly Z_BACK_HOGLINE_VELOCITY = 4.04;
    private readonly Z_BACKLINE_VELOCITY = 4.46377;
    private readonly Z_RINGS_CENTER_VELOCITY = 4.357;
    private readonly HARD_COLLISION_SPEED = 1.8;
    private readonly SOFT_COLLISION_SPEED = 1.3;
    private gameController: GameController;
    private physicsManager: PhysicsManager;
    private stoneThrown = false;

    public static getInstance(): AIPlayingState {
        return AIPlayingState.instance;
    }

    public init(gameController: GameController): void {
        this.gameController = gameController;
        this.physicsManager = PhysicsManager.getInstance();
        this.physicsManager.init();
    }

    private constructor() {
        if (AIPlayingState.instance) {
            throw new Error("Error: AIPlayingState is a singleton class, " +
                "use AIPlayingState.getInstance() instead of new.");
        }
        AIPlayingState.instance = this;
    }

    public onMouseDown(event: MouseEvent): void {
        // Do nothing
    }

    public onMouseUp(event: MouseEvent): void {
        // Do nothing
    }

    public onMouseMove(event: MouseEvent): void {
        // Do nothing
    }

    public onKeyboardDown(event: KeyboardEvent): void {
        // Do nothing
    }

    public update(delta: number): void {
        if (this.stoneThrown) {
            this.physicsManager.update(delta);

            if (this.physicsManager.allStonesHaveStopped()) {
                this.gameController.getGameData().state = this.nextState();
            }
        }
    }

    public enterState(): AIPlayingState {
        document.body.style.cursor = "default";

        const hudData = this.gameController.getHUDData();
        hudData.sliderDisabled = true;
        const startZ = SceneBuilder.getInstance().getRinkData().lines.start;

        const nextStone = new CurlingStone(Team.AI, new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, startZ));
        this.stoneThrown = false;
        GameEngine.getInstance().addStone(nextStone);
        GameEngine.getInstance().removeHighlightOnAllStones();

        setTimeout(() => {
            (this.gameController.getAIDifficulty() === AIDifficulty.Normal) ?
                this.throwNormalStone(nextStone) : this.throwHardStone(nextStone);
            nextStone.setHasBeenShot();
            hudData.aiStones.pop();
            this.stoneThrown = true;
        }, this.THROW_DELAY_MS);

        return this;
    }

    public nextState(): IGameState {
        this.physicsManager.sortStonesByDistance();
        this.physicsManager.cleanFastIceSpots();
        return EndThrowState.getInstance().enterState();
    }

    private throwNormalStone(stone: CurlingStone): void {
        let velocity = new THREE.Vector3(0, 0, 0);
        stone.setRandomSpinOrientation();

        if (Math.random() > this.NORMAL_FAILED_FACTOR) {
            // CASE 1 : Intentionally miss the shot
            velocity.setX(getRandomFloat(-this.X_FAILED_MAX_VELOCITY, this.X_FAILED_MAX_VELOCITY));
            velocity.setZ(getRandomFloat(this.Z_FRONT_HOGLINE_VELOCITY, this.Z_BACK_HOGLINE_VELOCITY));
        } else {
            // CASE 2 : Normal shot that stays in game if there are no other stones
            // Shoot in opposite direction of spin
            velocity.setX(-stone.getSpinOrientation() * getRandomFloat(0, this.X_SUCCESS_MAX_VELOCITY));
            velocity.setZ(getRandomFloat(this.Z_BACK_HOGLINE_VELOCITY, this.Z_BACKLINE_VELOCITY));
        }

        stone.setVelocity(velocity);
    }

    private throwHardStone(stone: CurlingStone): void {
        // Get the distance from the middle of the white ring
        let ringsData = SceneBuilder.getInstance().getRinkData().rings;
        let whiteRing = (ringsData.middle + ringsData.inner) / 2;
        let velocity = new THREE.Vector3(0, 0, 0);
        let playerStone = this.physicsManager.getTeamStoneWithinDistance(Team.Player, whiteRing);
        let initialVelocity: THREE.Vector3;

        if (playerStone !== undefined) {
            // CASE 1 : If there is player's stone within the middle of the white ring, aims that specific stone
            let finalAimingPosition = this.getSpinAndFinalPosition(playerStone.position.clone(), stone);
            let finalVelocityZ = 1;
            const velocityToPosition = this.physicsManager
                .getVelocityToPosition(finalAimingPosition.clone(), finalVelocityZ, stone.getSpinOrientation());

            // Finds if there is a stone in the way and change the initialVelocity accordingly
            initialVelocity = this.checkAndHandleObstacleStone(stone, velocityToPosition, playerStone.position.clone());
        } else {
            // CASE 2 : There is no player stone in house
            // Perfect shot that aims inside the red ring as closest to center as possbile
            initialVelocity = this.getVelocityForPerfectShotNearCenter(stone);
        }

        velocity.setX(initialVelocity.x);
        velocity.setZ(initialVelocity.z);
        stone.setVelocity(velocity);
    }

    private getVelocityForPerfectShotNearCenter(aiStone: CurlingStone): THREE.Vector3 {
        let ringsCenterPosition = new THREE.Vector3(0, 0, SceneBuilder.getInstance().getRinkData().rings.offset);
        let finalAimingPosition = ringsCenterPosition;
        aiStone.setRandomSpinOrientation();
        let initialVelocity = new THREE.Vector3(-aiStone.getSpinOrientation() * this.X_HOUSE_CENTER_VELOCITY,
            0, this.Z_RINGS_CENTER_VELOCITY);
        let tmpStone = new CurlingStone(Team.AI, initialVelocity.clone(),
            new THREE.Vector3(0, 0, SceneBuilder.getInstance().getRinkData().lines.start));
        tmpStone.setSpinOrientation(aiStone.getSpinOrientation());

        // Find a place and a velocity to shoot near the center if the center is occupied or if
        // The stone encounters an obstacle in the trajectory
        if (this.physicsManager.findStoneAtPosition(ringsCenterPosition) !== undefined ||
            this.physicsManager.findObstacleStone(tmpStone, finalAimingPosition) === undefined) {
            let velocityFound = false;
            const maxTries = 50;
            let tries = 0;
            let distanceToCenter = CurlingStone.MAX_DIAMETER;

            while (!velocityFound) {
                if (++tries >= maxTries) {
                    distanceToCenter += CurlingStone.MAX_RADIUS;
                    tries = 0;
                }

                // Get a random angle between 0 and 360 degrees to shoot in the red ring
                let angle = THREE.Math.degToRad(getRandomFloat(0, 360));
                finalAimingPosition = new THREE.Vector3(Math.cos(angle) * distanceToCenter,
                    0, Math.sin(angle) * distanceToCenter + ringsCenterPosition.z);

                if (this.physicsManager.findStoneAtPosition(finalAimingPosition) === undefined) {
                    velocityFound = true;
                }
            }

            // Set the spin orientation accordingly
            aiStone.setSpinOrientation(Math.sign(finalAimingPosition.x));
            initialVelocity = this.physicsManager
                .getVelocityToPosition(finalAimingPosition, 0, aiStone.getSpinOrientation());
        }

        // Check if there is any obstacle and handle it
        initialVelocity = this.checkAndHandleObstacleStone(aiStone, initialVelocity, finalAimingPosition);
        return initialVelocity.clone();
    }

    // Set the spin of the aiStone and the finalAimingPosition according to the aimingStonePosition
    public getSpinAndFinalPosition(aimingStonePosition: THREE.Vector3, aiStone: CurlingStone): THREE.Vector3 {
        let finalAimingPosition = aimingStonePosition.clone();
        aiStone.setSpinOrientation(aimingStonePosition.x > 0 ?
            SpinOrientation.COUNTER_CLOCKWISE : SpinOrientation.CLOCKWISE);
        finalAimingPosition.x = aimingStonePosition.x - CurlingStone.MAX_DIAMETER * Math.sign(aimingStonePosition.x);
        return finalAimingPosition;
    }

    private checkAndHandleObstacleStone(aiStone: CurlingStone, initialVelocity: THREE.Vector3,
        playerStonePosition: THREE.Vector3): THREE.Vector3 {
        // Finds if there is a stone in the way
        const rinkData = SceneBuilder.getInstance().getRinkData();
        let tmpStone = new CurlingStone(Team.AI, initialVelocity.clone(),
            new THREE.Vector3(0, 0, rinkData.lines.start));
        tmpStone.setSpinOrientation(aiStone.getSpinOrientation());
        let finalAimingPosition = playerStonePosition;
        let obstacleStone = this.physicsManager.findObstacleStone(tmpStone, finalAimingPosition);

        // If there is a stone in the way
        if (obstacleStone) {
            // Try to change the spin to avoid the obstacle
            initialVelocity = this.physicsManager
                .getVelocityToPosition(finalAimingPosition, this.HARD_COLLISION_SPEED, aiStone.switchSpinOrientation());

            // Check if there is still an obstacle
            obstacleStone = this.physicsManager.findObstacleStone(tmpStone, finalAimingPosition);

            if (obstacleStone) {
                // If there is a playerStone is in the way, aim that playerStone
                if (obstacleStone.getTeam() === Team.Player) {
                    finalAimingPosition = this.getSpinAndFinalPosition(obstacleStone.position.clone(), aiStone);
                    // Change the trajectory to aim the obstacle stone
                    initialVelocity = this.physicsManager.getVelocityToPosition(finalAimingPosition,
                        this.SOFT_COLLISION_SPEED, aiStone.getSpinOrientation());
                } else {
                    // There is an AIStone in the way.
                    // If the aiStone aims the center, set the finalVelocityZ to 0 to not affect the stones in the ring
                    const ringsCenter = new THREE.Vector3(0, 0, rinkData.rings.offset);
                    finalAimingPosition.x += CurlingStone.MAX_DIAMETER * Math.sign(finalAimingPosition.x);
                    if (finalAimingPosition.distanceTo(ringsCenter) < rinkData.rings.inner) {
                        initialVelocity = this.physicsManager
                            .getVelocityToPosition(finalAimingPosition, 0, aiStone.getSpinOrientation());
                    } else {
                        // Set final position in z to 1.8 to hit the obstacle aiStone so it hits the aimingPlayerStone
                        initialVelocity = this.physicsManager.getVelocityToPosition(finalAimingPosition,
                            this.HARD_COLLISION_SPEED, aiStone.getSpinOrientation());
                    }
                }
            }
        }

        return initialVelocity;
    }
}
