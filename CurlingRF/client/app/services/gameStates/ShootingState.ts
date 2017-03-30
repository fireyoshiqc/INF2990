import { IGameState } from './GameState';
import { SweepingState } from './SweepingState';
import { GameController } from '../GameController.service';

export class ShootingState implements IGameState {

    private static instance: ShootingState = new ShootingState();
    private gameController: GameController;

    public static getInstance(): ShootingState {
        return ShootingState.instance;
    }

    public init(gameController: GameController): void {
        this.gameController = gameController;
    }

    private constructor() {
        if (ShootingState.instance) {
            throw new Error("Error: ShootingState " +
                "is a singleton class, use ShootingState.getInstance() instead of new.");
        }
        ShootingState.instance = this;
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

    public enterState(): ShootingState {
        // Do nothing yet, but return this state.
        document.body.style.cursor = "default";
        return this;
    }

    public nextState(): SweepingState {
        return SweepingState.getInstance().enterState();
    }
}
