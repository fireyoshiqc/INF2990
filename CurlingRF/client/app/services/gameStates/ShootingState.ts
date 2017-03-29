import { IGameState } from './GameState';
import { GameEngine } from '../gameEngine.service';

export class ShootingState implements IGameState {

    private static instance: ShootingState = new ShootingState();
    private gameEngine: GameEngine;

    public static getInstance(): ShootingState {
        return ShootingState.instance;
    }

    public init(): void {
        this.gameEngine = GameEngine.getInstance();
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
}
