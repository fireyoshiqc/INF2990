import { GameState } from './GameState';
import { GameController } from '../gameController.service';

export class ChoosingAngleState implements GameState {

    private gameController: GameController;
    mouse: THREE.Vector2;
    raycaster: THREE.Raycaster;
    waiting: boolean;

    constructor(gameController: GameController) {
        this.gameController = gameController;
        this.mouse = new THREE.Vector2();
    }

    onMouseDown(event: any): void {
        //empty for the moment
    }

    onMouseUp(event: any): void {
        //empty for the moment
    }

    onMouseMove(event: any): void {
        if (!this.waiting) {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            this.gameController.getGameRenderer().calculateAngle(this.mouse);
            this.waiting = true;
            setTimeout(() => {
                this.waiting = false;
            }, 50);
        }
    }

}
