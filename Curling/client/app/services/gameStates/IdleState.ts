import { IGameState } from './GameState';
import { GameController } from '../gameController.service';

export class IdleState implements IGameState {

    private gameController: GameController;

    constructor(gameController: GameController) {
        this.gameController = gameController;
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
}
