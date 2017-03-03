import { GameState } from './GameState';
import { GameController } from '../gameController.service';

export class ChoosingAngleState implements GameState {

    private gameController: GameController;
    mouse: THREE.Vector2;
    waiting: boolean;
    angle: number;

    constructor(gameController: GameController) {
        this.gameController = gameController;
        this.mouse = new THREE.Vector2();
        this.angle = null;
    }

    onMouseDown(event: any): void {
        //nothing
    }

    onMouseUp(event: any): void {
        if (this.angle !== null) {
            this.gameController.setShootingAngle(this.angle);
            this.gameController.enterShootingState();
        }
    }

    onMouseMove(event: any): void {
        if (!this.waiting) {
            this.setMouse(event);
            let angle = this.gameController.getGameRenderer().calculateAngle(this.mouse);
            if (angle !== null) {
                this.gameController.getGameRenderer().updateDirectionCurve(this.angle - angle);
                console.log(angle);
                this.angle = angle;
            }
            this.waiting = true;
            setTimeout(() => {
                this.waiting = false;
            }, 10);
        }
    }

    setMouse(event: any): void {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

}
