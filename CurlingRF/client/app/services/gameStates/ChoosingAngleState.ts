import { IGameState } from './GameState';
import { ShootingState } from './ShootingState';
import { GameController } from '../gameController.service';

export class ChoosingAngleState implements IGameState {

    private static instance: ChoosingAngleState = new ChoosingAngleState();
    private gameController: GameController;

    public static getInstance(): ChoosingAngleState {
        return ChoosingAngleState.instance;
    }

    public init(gameController: GameController): void {
        this.gameController = gameController;
    }

    private constructor() {
        if (ChoosingAngleState.instance) {
            throw new Error("Error: ChoosingAngleState " +
                "is a singleton class, use ChoosingAngleState.getInstance() instead of new.");
        }
        ChoosingAngleState.instance = this;
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

    public enterState(): ChoosingAngleState {
        // Do nothing yet, but return this state.
        return this;
    }

    public nextState(): ShootingState {
        return ShootingState.getInstance().enterState();
    }

}
