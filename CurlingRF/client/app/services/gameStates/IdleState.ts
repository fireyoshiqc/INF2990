import { IGameState } from './GameState';
import { ChoosingAngleState } from './ChoosingAngleState';
import { GameController } from '../gameController.service';
import { GameEngine } from '../gameEngine.service';
import { SceneBuilder } from '../sceneBuilder.service';
import { CurlingStone, Team, SpinOrientation } from '../../entities/curlingStone';

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
        document.body.style.cursor = "default";
        const gameData = this.gameController.getGameData();
        const hudData = this.gameController.getHUDData();
        const team = gameData.isPlayerTurn ? Team.Player : Team.AI;
        const startZ = SceneBuilder.getInstance().getRinkData().lines.start;
        const stone = new CurlingStone(team, new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, startZ));
        GameEngine.getInstance().addStone(stone);
        gameData.forceValue = 0;
        hudData.sliderDisabled = false;
        return this;
    }

    public nextState(): ChoosingAngleState {
        const gameData = this.gameController.getGameData();
        const spin = gameData.spinClockwise ? SpinOrientation.CLOCKWISE : SpinOrientation.COUNTER_CLOCKWISE;
        GameEngine.getInstance().getActiveStone().setSpinOrientation(spin);
        return ChoosingAngleState.getInstance().enterState();
    }
}
