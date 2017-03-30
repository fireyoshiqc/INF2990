import { IGameState } from './GameState';
import { ChoosingAngleState } from './ChoosingAngleState';
import { GameController } from '../gameController.service';
import { GameEngine } from '../gameEngine.service';
import { SceneBuilder } from '../sceneBuilder.service';
import { CurlingStone, Team } from '../../entities/curlingStone';

export class IdleState implements IGameState {

    private static instance: IdleState = new IdleState();
    private gameController: GameController;

    public static getInstance(): IdleState {
        return IdleState.instance;
    }

    public init(gameController: GameController): void {
        this.gameController = gameController;
    }

    private constructor() {
        if (IdleState.instance) {
            throw new Error("Error: IdleState is a singleton class, use IdleState.getInstance() instead of new.");
        }
        IdleState.instance = this;
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
        // Do nothing
    }

    public enterState(): IdleState {
        // Do nothing yet, but return this state.
        document.body.style.cursor = "default";
        const gameData = this.gameController.getGameData();
        const team = gameData.isPlayerTurn ? Team.Player : Team.AI;
        const startZ = SceneBuilder.getInstance().getRinkData().lines.start;
        const stone = new CurlingStone(team, null,
            new THREE.Vector3(0, 0, startZ));
        GameEngine.getInstance().addStone(stone);
        return this;
    }

    public nextState(): ChoosingAngleState {
        return ChoosingAngleState.getInstance().enterState();
    }
}
