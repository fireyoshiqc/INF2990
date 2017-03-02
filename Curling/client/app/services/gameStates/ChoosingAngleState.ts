import { GameState } from './GameState';
import { GameController } from '../gameController.service';

export class ChoosingAngleState implements GameState{

    private gameController : GameController;

    constructor(gameController: GameController) {
        this.gameController = gameController;
    }

    onMouseDown(event: any): void {
        //empty for the moment
    }

    onMouseUp(event: any): void {
        //empty for the moment
    }

    onMouseMove(event: any): void {
        console.log(event.clientX, event.clientY);
    }

}