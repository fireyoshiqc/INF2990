import { IGameState } from './GameState';
import { ChoosingAngleState } from './ChoosingAngleState';
import { GameController } from '../gameController.service';
import { GameEngine } from '../gameEngine.service';
import { SceneBuilder } from '../sceneBuilder.service';
import { CurlingStone, Team, SpinOrientation } from '../../entities/curlingStone';

export class PlayerIdleState implements IGameState {

    private static instance: PlayerIdleState = new PlayerIdleState();
    private gameController: GameController;

    public static getInstance(): PlayerIdleState {
        return PlayerIdleState.instance;
    }

    public init(gameController: GameController): void {
        this.gameController = gameController;
    }

    private constructor() {
        if (PlayerIdleState.instance) {
            throw new Error("Error: PlayerIdleState is a singleton class, " +
                            "use PlayerIdleState.getInstance() instead of new.");
        }
        PlayerIdleState.instance = this;
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
        // Do nothing
    }

    public enterState(): PlayerIdleState {
        document.body.style.cursor = "default";
        const gameData = this.gameController.getGameData();
        const hudData = this.gameController.getHUDData();
        const startZ = SceneBuilder.getInstance().getRinkData().lines.start;
        const stone = new CurlingStone(Team.Player, new THREE.Vector3(0, 0, 0),
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
