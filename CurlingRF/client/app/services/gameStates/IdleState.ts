import { IGameState } from './GameState';
import { ChoosingAngleState } from './ChoosingAngleState';
import { GameEngine } from '../gameEngine.service';

export class IdleState implements IGameState {

    private static instance: IdleState = new IdleState();
    private gameEngine: GameEngine;

    public static getInstance(): IdleState {
        return IdleState.instance;
    }

    public init(): void {
        this.gameEngine = GameEngine.getInstance();
    }

    private constructor() {
        if (IdleState.instance) {
            throw new Error("Error: IdleState is a singleton class, use IdleState.getInstance() instead of new.");
        }
        IdleState.instance = this;
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

    public enterState(): IdleState {
        // Do nothing yet, but return this state.
        document.body.style.cursor = "default";
        // if (this.isPlayerTurn) {
        //     this.addStone(Team.Player, new THREE.Vector3(0, 0, Rink.BACK_LINE / 2));
        // } else {
        //     this.addStone(Team.AI, new THREE.Vector3(0, 0, Rink.BACK_LINE / 2));
        // }
        return this;
    }

    public nextState(): ChoosingAngleState {
        return ChoosingAngleState.getInstance().enterState();
    }
}
