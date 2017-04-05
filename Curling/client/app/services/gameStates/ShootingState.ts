import { IGameState } from './GameState';
import { SweepingState } from './SweepingState';
import { GameController } from '../gameController.service';
import { ChoosingAngleState } from './ChoosingAngleState';
import { GameEngine } from '../gameEngine.service';

export class ShootingState implements IGameState {

    private static instance: ShootingState = new ShootingState();
    private gameController: GameController;
    private readonly MAX_INITIAL_SPEED = 5;
    private readonly MIN_INITIAL_SPEED = 1;
    private readonly MAX_HOLD_TIME_MS = 2000;
    private readonly INTERVAL_DELAY_MS = 100;

    private timer: any;
    private initialSpeedCounter = 0;

    public static getInstance(): ShootingState {
        return ShootingState.instance;
    }

    public init(gameController: GameController): void {
        this.gameController = gameController;
    }

    private constructor() {
        if (ShootingState.instance) {
            throw new Error("Error: ShootingState " +
                "is a singleton class, use ShootingState.getInstance() instead of new.");
        }
        ShootingState.instance = this;
    }

    public onMouseDown(event: any): void {
        this.timer = setInterval(() => {
            if (this.initialSpeedCounter < this.MAX_INITIAL_SPEED) {
                this.initialSpeedCounter += this.MAX_INITIAL_SPEED / (this.MAX_HOLD_TIME_MS / this.INTERVAL_DELAY_MS);
                this.gameController.getGameData().forceValue = this.initialSpeedCounter / this.MAX_INITIAL_SPEED * 100;
            }
        }, this.INTERVAL_DELAY_MS);
    }

    public onMouseUp(event: any): void {
        // Stone won't be thrown if the powerbar isn't charged enough.
        let gameData = this.gameController.getGameData();
        let hudData = this.gameController.getHUDData();

        clearInterval(this.timer);

        if (this.initialSpeedCounter > this.MIN_INITIAL_SPEED) {
            // Get angle at which to shoot the stone
            // Shoot the stone and set all its states appropriately
            let stone = GameEngine.getInstance().getStones()[GameEngine.getInstance().getStones().length - 1];
            stone.setHasBeenShot();
            stone.getVelocity().add(new THREE.Vector3(this.initialSpeedCounter * Math.sin(gameData.curveAngle),
                0, this.initialSpeedCounter * Math.cos(gameData.curveAngle)));
            this.initialSpeedCounter = 0;
            hudData.playerStones.pop();

            // Enter sweeping state once the stone has been thrown
            gameData.state = this.nextState();
        } else {
            // Reset the powerbar if it isn't charged enough.
            this.initialSpeedCounter = 0;
            gameData.state = ChoosingAngleState.getInstance().enterState();
            gameData.forceValue = 0;
        }
    }

    public onMouseMove(event: any): void {
        // Do nothing
    }

    public onKeyboardDown(event: KeyboardEvent): void {
        // Do nothing
    }

    public update(delta: number): void {
        // Animate the angle line while the shot is being charged
        ChoosingAngleState.getInstance().update(delta);
    }

    public enterState(): ShootingState {
        // Make the force bar visible
        document.body.style.cursor = "default";
        this.gameController.getHUDData().forceVisible = true;
        return this;
    }

    public nextState(): SweepingState {
        return SweepingState.getInstance().enterState();
    }
}
