/**
 * EndThrowState.ts
 *
 * @authors Pierre To
 * @date 2017/03/22
 */

import { IGameState } from './GameState';
import { IdleState } from './IdleState';
import { GameController } from '../gameController.service';
import { GameEngine } from '../gameEngine.service';
import { SceneBuilder } from '../sceneBuilder.service';

export class EndThrowState implements IGameState {

    private static instance: EndThrowState = new EndThrowState();
    private gameController: GameController;

    public static getInstance(): EndThrowState {
        return EndThrowState.instance;
    }

    public init(gameController: GameController): void {
        this.gameController = gameController;
    }

    private constructor() {
        if (EndThrowState.instance) {
            throw new Error("Error: EndThrowState " +
                "is a singleton class, use EndThrowState.getInstance() instead of new.");
        }
        EndThrowState.instance = this;
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

    public enterState(): EndThrowState {
        // Do nothing yet, but return this state.
        this.highlightStonesWorthPoints();
        console.log("Highlight the stones!!");
        return this;
    }

    public nextState(): IdleState {
        return IdleState.getInstance().enterState();
    }

    // Highlight stones that are currently worth points
    private highlightStonesWorthPoints(): void {

        let curlingStones = GameEngine.getInstance().getStones();
        let rings = SceneBuilder.getInstance().getRinkData().rings;

        if (curlingStones.length > 0) {

            let teamClosestStone = curlingStones[0].getTeam();
            let index = 0;

            const ringsCenter = new THREE.Vector3(0, 0, rings.offset);

            while (curlingStones.length > index &&
                curlingStones[index].getTeam() === teamClosestStone &&
                curlingStones[index].position.distanceTo(ringsCenter) < rings.outer) {

                curlingStones[index++].highlightOn();

            }
        }
    }
}
