/**
 * AIPlayingState.ts
 *
 * @authors Vincent Chassé, Pierre To, Yawen Hou
 * @date 2017/04/04
 */

import { IGameState } from './GameState';
import { EndThrowState } from './EndThrowState';
import { GameController } from '../gameController.service';
import { GameEngine } from '../gameEngine.service';
import { PhysicsManager } from '../physicsManager.service';
import { SceneBuilder } from '../sceneBuilder.service';
import { CurlingStone, Team } from '../../entities/curlingStone';

export class AIPlayingState implements IGameState {

    private static instance: AIPlayingState = new AIPlayingState();
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

        const stone = new CurlingStone(Team.AI, new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, startZ));
        this.stoneThrown = false;
        GameEngine.getInstance().addStone(stone);

        let timer = setInterval(() => {
            if (this.gameController.getPlayerName() !== "") {
                stone.setVelocity(new THREE.Vector3(Math.random(), 0, 3 * Math.random()));
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
}
