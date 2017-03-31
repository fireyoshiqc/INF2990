import { IGameState } from './GameState';
import { EndThrowState } from './EndThrowState';
import { ChoosingAngleState } from './ChoosingAngleState';
import { GameController } from '../gameController.service';
import { PhysicsManager } from '../physicsManager.service';
import { GameEngine } from '../gameEngine.service';
import { CurlingStone } from '../../entities/curlingStone';

export class SweepingState implements IGameState {

    private static instance: SweepingState = new SweepingState();
    private gameController: GameController;
    private physicsManager: PhysicsManager;

    public static getInstance(): SweepingState {
        return SweepingState.instance;
    }

    public init(gameController: GameController): void {
        this.gameController = gameController;
        this.physicsManager = PhysicsManager.getInstance();
        this.physicsManager.init();
    }

    private constructor() {
        if (SweepingState.instance) {
            throw new Error("Error: SweepingState " +
                "is a singleton class, use SweepingState.getInstance() instead of new.");
        }
        SweepingState.instance = this;
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

        this.physicsManager.update(delta);

        if (this.physicsManager.allStonesHaveStopped()) {
            this.gameController.getGameData().state = this.nextState();
        }
    }

    public enterState(): SweepingState {
        ChoosingAngleState.getInstance().hideCurve();
        return this;
    }

    public nextState(): EndThrowState {
        this.physicsManager.sortStonesByDistance();
        return EndThrowState.getInstance().enterState();
    }
}
