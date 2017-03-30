import { IGameState } from './GameState';
import { EndThrowState } from './EndThrowState';
import { GameController } from '../GameController.service';

export class SweepingState implements IGameState {

    private static instance: SweepingState = new SweepingState();
    private gameController: GameController;

    public static getInstance(): SweepingState {
        return SweepingState.instance;
    }

    public init(gameController: GameController): void {
        this.gameController = gameController;
    }

    private constructor() {
        if (SweepingState.instance) {
            throw new Error("Error: SweepingState " +
                "is a singleton class, use SweepingState.getInstance() instead of new.");
        }
        SweepingState.instance = this;
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

    public enterState(): SweepingState {
        // Do nothing yet, but return this state.
        return this;
    }

    public nextState(): EndThrowState {
        return EndThrowState.getInstance().enterState();
    }
}
