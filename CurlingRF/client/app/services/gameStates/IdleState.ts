import { IGameState } from './GameState';
import { GameEngine } from '../gameEngine.service';

export class IdleState implements IGameState {

    private static instance: IdleState = new IdleState();
    private gameEngine: GameEngine;

    public static getInstance(): IdleState {
        return IdleState.instance;
    }

    public init(): void {
        this.gameEngine = GameEngine.getInstance();
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
}
