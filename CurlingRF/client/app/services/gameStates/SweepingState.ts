import { IGameState } from './GameState';
import { GameEngine } from '../gameEngine.service';

export class SweepingState implements IGameState {

    private static instance: SweepingState = new SweepingState();
    private gameEngine: GameEngine;

    public static getInstance(): SweepingState {
        return SweepingState.instance;
    }

    public init(): void {
        this.gameEngine = GameEngine.getInstance();
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
}
