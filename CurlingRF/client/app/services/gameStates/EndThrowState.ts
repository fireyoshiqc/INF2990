/**
 * EndThrowState.ts
 *
 * @authors Pierre To
 * @date 2017/03/22
 */

import { IGameState } from './GameState';
import { IdleState } from './IdleState';
import { GameEngine } from '../gameEngine.service';

export class EndThrowState implements IGameState {

    private static instance: EndThrowState = new EndThrowState();
    private gameEngine: GameEngine;

    public static getInstance(): EndThrowState {
        return EndThrowState.instance;
    }

    public init(): void {
        this.gameEngine = GameEngine.getInstance();
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
        return this;
    }

    public nextState(): IdleState {
        return IdleState.getInstance().enterState();
    }
}
