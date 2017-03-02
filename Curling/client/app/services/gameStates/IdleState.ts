import { GameState } from './GameState';
import { GameController } from '../gameController.service';

export class IdleState implements GameState{

    private gameController : GameController;

    constructor(gameController: GameController) {
        this.gameController = gameController;
    }

    onMouseDown(event: any): void {
        //Do nothing
    }

    onMouseUp(event: any): void {
         //Do nothing
    }

    onMouseMove(event: any): void {
        //Do nothing
    }

}
