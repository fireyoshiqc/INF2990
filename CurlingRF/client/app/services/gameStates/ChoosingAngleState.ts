import { IGameState } from './GameState';
import { GameEngine } from '../gameEngine.service';

export class ChoosingAngleState implements IGameState {

    private static instance: ChoosingAngleState = new ChoosingAngleState();
    private gameEngine: GameEngine;

    public getInstance(): ChoosingAngleState {
        return ChoosingAngleState.instance;
    }

    public init(): void {
        this.gameEngine = GameEngine.getInstance();
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

}
