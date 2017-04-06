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

export class AIPlayingState implements IGameState {
    private static instance: AIPlayingState = new AIPlayingState();
    private readonly EASY_FAILED_FACTOR = 0.67;
    private readonly FAILED_X_MAX_VELOCITY = 0.5;
    private readonly SUCCESS_X_MAX_VELOCITY = 0.15;
    private readonly Z_FRONT_HOGLINE_VELOCITY = 2.15;
    private readonly Z_BACK_HOGLINE_VELOCITY = 4.034;
    private readonly Z_BACKLINE_VELOCITY = 4.46;
    private gameController: GameController;
    private physicsManager: PhysicsManager;
    private stoneThrown = false;
    private difficulty: AIDifficulty;

    public static getInstance(): AIPlayingState {
        return AIPlayingState.instance;
    }

    public init(gameController: GameController): void {
        this.gameController = gameController;
        this.physicsManager = PhysicsManager.getInstance();
        this.physicsManager.init();
        this.difficulty = AIDifficulty.Undefined;
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

        const stone = new CurlingStone(Team.AI, new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, startZ));
        this.stoneThrown = false;
        GameEngine.getInstance().addStone(stone);

        let timer = setInterval(() => {
            if (this.gameController.getPlayerName() !== "") {
                // Set AIDifficulty
                this.difficulty = this.gameController.getAIDifficulty();

                (this.difficulty === AIDifficulty.Normal) ? this.throwNormalStone(stone) : this.throwHardStone(stone);

                stone.setHasBeenShot();
                hudData.aiStones.pop();
                this.stoneThrown = true;
                clearInterval(timer);
            }
        }, 2000);

        return this;
    }

    public nextState(): EndThrowState {
        this.physicsManager.sortStonesByDistance();
        this.physicsManager.cleanFastIceSpots();
        return EndThrowState.getInstance().enterState();
    }

    private getRandomFloat(min: number, max: number): number {
        return (Math.random() * (max - min)) + min;
    }

    private throwNormalStone(stone: CurlingStone): void {
        let velocity: THREE.Vector3;
        let spin: SpinOrientation;

        if (Math.random() > this.EASY_FAILED_FACTOR) {
            // Intentionally miss the shot
            spin = (Math.random() > 0.5) ? SpinOrientation.CLOCKWISE : SpinOrientation.COUNTER_CLOCKWISE;
            stone.setSpinOrientation(spin);

            let xVelocity = this.getRandomFloat(-this.FAILED_X_MAX_VELOCITY, this.FAILED_X_MAX_VELOCITY);
            let zVelocity = this.getRandomFloat(this.Z_FRONT_HOGLINE_VELOCITY, this.Z_BACK_HOGLINE_VELOCITY);
            velocity = new THREE.Vector3(xVelocity, 0, zVelocity);
        } else {
            // Calculate the shot
            spin = (Math.random() > 0.5) ? SpinOrientation.CLOCKWISE : SpinOrientation.COUNTER_CLOCKWISE;

            let xVelocity = spin * this.getRandomFloat(0, this.SUCCESS_X_MAX_VELOCITY);
            let zVelocity = this.getRandomFloat(this.Z_BACK_HOGLINE_VELOCITY, this.Z_BACKLINE_VELOCITY);
            velocity = new THREE.Vector3(xVelocity, 0, zVelocity);
        }

        stone.setVelocity(velocity);
        console.log("EASY THROW : ", velocity);
    }

    private throwHardStone(stone: CurlingStone): void {
        stone.setVelocity(new THREE.Vector3(Math.random(), 0, 3 * Math.random()));
    }
}
