import { IGameState } from './GameState';
import { GameController } from '../gameController.service';

export class SweepingState implements IGameState {

    private gameController: GameController;
    private mouse: THREE.Vector2;
    private sweeping = false;
    private canSweep = false;

    constructor(gameController: GameController) {
        this.gameController = gameController;
        this.mouse = new THREE.Vector2();
    }

    public onMouseDown(event: any): void {
        this.setMouse(event);
        let intersects = this.gameController.getGameRenderer().checkIfMouseOnIce(this.mouse);

        if (intersects.length > 0 && !this.sweeping && this.canSweep) {
            this.sweeping = true;
        }
    }

    public onMouseUp(event: any): void {
        this.setMouse(event);
        if (this.sweeping) {
            let intersects = this.gameController.getGameRenderer().checkIfMouseOnIce(this.mouse);

            if (intersects.length > 0) {
                let intersectionPoint = intersects[intersects.length - 1].point;
                let rink = this.gameController.getGameRenderer().getRink();
                let id = rink.addSpot(intersectionPoint.x, intersectionPoint.z + rink.getRinkLength() / 2);
                this.gameController.getGameRenderer().getPhysicsManager().addSweptSpot(
                    new THREE.Vector3(intersectionPoint.x, 0, intersectionPoint.z), id, rink.getSpot(id));
                this.sweeping = false;
            }
        }
    }

    public onMouseMove(event: any): void {
        // Do nothing
    }

    public onKeyboardDown(event: KeyboardEvent): void {
        // Do nothing
    }

    public setMouse(event: any): void {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    public setCanSweep(canSweep: boolean): void {
        this.canSweep = canSweep;
    }

    public getCanSweep(): boolean {
        return this.canSweep;
    }

    public isSweeping(): boolean{
        return this.sweeping;
    }

    public setIsSweeping(sweeping: boolean): void {
        this.sweeping = sweeping;
    }

}
