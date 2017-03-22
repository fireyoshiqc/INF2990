/**
 * EndThrowState.ts
 *
 * @authors Pierre To
 * @date 2017/03/22
 */

import { IGameState } from './GameState';
import { GameController } from '../gameController.service';

export class EndThrowState implements IGameState {

    private gameController: GameController;

    constructor(gameController: GameController) {
        this.gameController = gameController;
    }

    public onMouseDown(event: any): void {
        if (this.gameController.getShowNextThrowMessage()) {
            this.gameController.startNextThrow();
        }

        if (this.gameController.getShowNextRoundMessage()) {
            this.gameController.startNextRound();
        }
    }

    public onMouseUp(event: any): void {
        // Do nothing
    }

    public onMouseMove(event: any): void {
        // Do nothing
    }

    public onKeyboardDown(event: KeyboardEvent): void {
        if (event.key === " ") { // Spacebar
            if (this.gameController.getShowNextThrowMessage()) {
                this.gameController.startNextThrow();
            }

            if (this.gameController.getShowNextRoundMessage()) {
                this.gameController.startNextRound();
            }
        }
    }
}
