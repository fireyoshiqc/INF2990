import { IGameState } from './GameState';
import { GameController } from '../gameController.service';

export class ShootingState implements IGameState {

    private readonly MAX_INITIAL_SPEED = 5;
    private readonly MIN_INITIAL_SPEED = 1;
    private readonly MAX_HOLD_TIME_MS = 2000;
    private readonly INTERVAL_DELAY_MS = 100;

    private timer: any;
    private initialSpeedCounter = 0;
    private gameController: GameController;

    constructor(gameController: GameController) {
        this.gameController = gameController;
    }

    public onMouseDown(event: any): void {
        this.timer = setInterval(() => {
            if (this.initialSpeedCounter < this.MAX_INITIAL_SPEED) {
                this.initialSpeedCounter += this.MAX_INITIAL_SPEED / (this.MAX_HOLD_TIME_MS / this.INTERVAL_DELAY_MS);
                this.gameController.setForceValue(this.initialSpeedCounter / this.MAX_INITIAL_SPEED * 100);
            }
        }, this.INTERVAL_DELAY_MS);
    }

    public onMouseUp(event: any): void {

        // Stone won't be thrown if the powerbar isn't charged enough.
        if (this.initialSpeedCounter > this.MIN_INITIAL_SPEED) {
            // Get angle at which to shoot the stone
            let shootingAngle = this.gameController.getShootingAngle();
            let angleInRad = THREE.Math.degToRad(shootingAngle);

            // Shoot the stone and set all its states appropriately
            let stone = this.gameController.getCurlingStones()[this.gameController.getCurlingStones().length - 1];
            stone.setHasBeenShot();
            stone.getVelocity().add(new THREE.Vector3(this.initialSpeedCounter * Math.sin(angleInRad),
                                    0, -this.initialSpeedCounter * Math.cos(angleInRad)));
            this.initialSpeedCounter = 0;
            this.gameController.removeThrownStoneFromHUD();

            // Enter sweeping state once the stone has been thrown
            this.gameController.enterSweepingState();
        } else {
            // Reset the powerbar if it isn't charged enough.
            this.initialSpeedCounter = 0;
            this.gameController.setForceValue(0);
            this.gameController.enterChoosingAngleState();
        }
        clearInterval(this.timer);
    }

    public onMouseMove(event: any): void {
        // Do nothing
    }

    public onKeyboardDown(event: KeyboardEvent): void {
        // Do nothing
    }

}
