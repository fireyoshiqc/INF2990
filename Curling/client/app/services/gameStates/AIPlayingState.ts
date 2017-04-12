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

    public onMouseDown(event: any): void {
        // Do nothing
    }

    public onMouseUp(event: any): void {
        // Do nothing
    }

    public onMouseMove(event: any): void {
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

        setTimeout(() => {
            GameEngine.getInstance().removeHighlightOnAllStones();

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
        let velocity: THREE.Vector3;
        let xVelocity: number;
        let zVelocity: number;
        stone.setRandomSpinOrientation();

        if (Math.random() > this.NORMAL_FAILED_FACTOR) {
            // CASE 1 : Intentionally miss the shot
            xVelocity = getRandomFloat(-this.X_FAILED_MAX_VELOCITY, this.X_FAILED_MAX_VELOCITY);
            zVelocity = getRandomFloat(this.Z_FRONT_HOGLINE_VELOCITY, this.Z_BACK_HOGLINE_VELOCITY);
        } else {
            // CASE 2 : Normal shot that stays in game if there are no other stones
            // Shoot in opposite direction of spin
            xVelocity = -stone.getSpinOrientation() * getRandomFloat(0, this.X_SUCCESS_MAX_VELOCITY);
            zVelocity = getRandomFloat(this.Z_BACK_HOGLINE_VELOCITY, this.Z_BACKLINE_VELOCITY);
        }

        velocity = new THREE.Vector3(xVelocity, 0, zVelocity);
        stone.setVelocity(velocity);
    }

    private throwHardStone(stone: CurlingStone): void {
        // Get the distance from the center of the white ring
        let whiteRing = (SceneBuilder.getInstance().getRinkData().rings.inner +
            SceneBuilder.getInstance().getRinkData().rings.middle) / 2;
        let velocity: THREE.Vector3;
        let xVelocity: number;
        let zVelocity: number;
        let playerStone = this.physicsManager.getTeamStoneWithinDistance(Team.Player, whiteRing);
        let obstacleStone: CurlingStone;

        if (playerStone !== undefined) {
            // CASE 1 : If there is player's stone within the middle of the white ring, aims for that specific stone
            if (playerStone.position.x > 0) {
                stone.setSpinOrientation(SpinOrientation.COUNTER_CLOCKWISE);
            } else if (playerStone.position.x < 0) {
                stone.setSpinOrientation(SpinOrientation.CLOCKWISE);
            } else {
                stone.setRandomSpinOrientation();
            }

            let finalVelocityZ = 2;
            let initialVelocity = this.physicsManager
                .getVelocityToPosition(playerStone.position, finalVelocityZ, stone.getSpinOrientation());

            // Finds if there is a stone in the way
            let tmpStone = new CurlingStone(Team.Player, initialVelocity.clone(),
                new THREE.Vector3(0, 0, SceneBuilder.getInstance().getRinkData().lines.start));
            tmpStone.setSpinOrientation(stone.getSpinOrientation());

            obstacleStone = this.physicsManager.findObstacleStone(tmpStone, playerStone.position);

            // If there is a stone in the way
            if (obstacleStone !== undefined) {
                // If there is a playerStone is in the way, aim that playerStone
                if (obstacleStone.getTeam() === Team.Player) {
                    let finalPosition = obstacleStone.position.clone();

                    if (obstacleStone.position.x > 0) {
                        stone.setSpinOrientation(SpinOrientation.COUNTER_CLOCKWISE);
                        finalPosition.x = obstacleStone.position.x - 2 * CurlingStone.MAX_RADIUS;
                    } else if (obstacleStone.position.x <= 0) {
                        stone.setSpinOrientation(SpinOrientation.CLOCKWISE);
                        finalPosition.x = obstacleStone.position.x + 2 * CurlingStone.MAX_RADIUS;
                    }
                    // Change the trajectory to aim the obstacle stone
                    initialVelocity = this.physicsManager
                        .getVelocityToPosition(finalPosition, 1.3, stone.getSpinOrientation());

                } else {
                    // TODO: If there is an AIStone in the way

                }
            }

            xVelocity = initialVelocity.x;
            zVelocity = initialVelocity.z;
        } else {
            // TODO: Aims inside the red ring instead of the center
            // CASE 2 : There is no player stone in house
            // Perfect shot that aims for the center of the rings
            stone.setRandomSpinOrientation();

            // Shoot in opposite direction of spin
            xVelocity = -stone.getSpinOrientation() * this.X_HOUSE_CENTER_VELOCITY;
            zVelocity = this.Z_RINGS_CENTER_VELOCITY;
        }

        velocity = new THREE.Vector3(xVelocity, 0, zVelocity);
        stone.setVelocity(velocity);
    }
}
