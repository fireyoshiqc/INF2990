import { IGameState } from './GameState';
import { EndThrowState } from './EndThrowState';
import { ChoosingAngleState } from './ChoosingAngleState';
import { GameController } from '../gameController.service';
import { PhysicsManager } from '../physicsManager.service';
import { GameEngine } from '../gameEngine.service';
import { SceneBuilder } from '../sceneBuilder.service';

export class SweepingState implements IGameState {

    private static instance: SweepingState = new SweepingState();
    private gameController: GameController;
    private physicsManager: PhysicsManager;

    private readonly MAX_BROOM_ANIM_FRAMES = 6;
    private readonly MIN_BROOM_ANIM_FRAMES = 1;

    private broomCursorFrame = this.MIN_BROOM_ANIM_FRAMES;
    private canSweep = false;
    private isSweeping = false;

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
        if (this.canSweep) {
            this.isSweeping = true;
        }
    }

    public onMouseUp(event: any): void {
        // Do nothing
        if (this.canSweep) {
            this.isSweeping = false;
        }
    }

    public onMouseMove(event: any): void {
        // Do nothing
    }

    public onKeyboardDown(event: KeyboardEvent): void {
        // Do nothing
    }

    public update(delta: number): void {

        this.physicsManager.update(delta);

        const activeStoneZPos = GameEngine.getInstance().getActiveStone().position.z;
        const rinkData = SceneBuilder.getInstance().getRinkData();

        if (!this.canSweep) {
            // Length minus hog gives the position of the first hog line.
            if (activeStoneZPos > rinkData.dims.length - rinkData.lines.hog) {
                this.canSweep = true;
            }
        } else {
            this.animateBroomCursor();
        }

        if (this.physicsManager.allStonesHaveStopped()) {
            this.gameController.getGameData().state = this.nextState();
        }
    }

    public enterState(): SweepingState {
        document.body.style.cursor = "url(../assets/textures/balai_rouge.png), auto";
        this.canSweep = false;
        this.isSweeping = false;
        ChoosingAngleState.getInstance().hideCurve();
        GameEngine.getInstance().getStones().forEach(stone => {
            stone.highlightOff();
        });
        return this;
    }

    public nextState(): EndThrowState {
        this.canSweep = false;
        this.isSweeping = false;
        this.broomCursorFrame = this.MIN_BROOM_ANIM_FRAMES;
        this.physicsManager.sortStonesByDistance();
        return EndThrowState.getInstance().enterState();
    }

    private animateBroomCursor(): void {
        if (this.isSweeping) {
            if (this.broomCursorFrame < this.MAX_BROOM_ANIM_FRAMES) {
                this.broomCursorFrame += 0.5;
            }
        } else {
            if (this.broomCursorFrame > this.MIN_BROOM_ANIM_FRAMES) {
                this.broomCursorFrame -= 0.5;
            }
        }

        document.body.style.cursor = "url(../assets/textures/balai_vert"
            + Math.floor(this.broomCursorFrame) + ".png), auto";
    }
}
