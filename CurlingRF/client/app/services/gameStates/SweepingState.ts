import { IGameState } from './GameState';
import { GameEngine } from '../gameEngine.service';

export class SweepingState implements IGameState {

    constructor(private gameEngine: GameEngine) {
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
