/**
 * startGameState.ts
 *
 * @authors Pierre To
 * @date 2017/04/07
 */

import { IGameState } from './GameState';
import { GameController } from '../gameController.service';
import { PlayerIdleState } from './PlayerIdleState';
import { AIPlayingState } from './AIPlayingState';

export class StartGameState implements IGameState {

    private static instance: StartGameState = new StartGameState();
    private gameController: GameController;

    public static getInstance(): StartGameState {
        return StartGameState.instance;
    }

    public init(gameController: GameController): void {
        this.gameController = gameController;
    }

    private constructor() {
        if (StartGameState.instance) {
            throw new Error("Error: StartGameState is a singleton class, " +
                "use StartGameState.getInstance() instead of new.");
        }
        StartGameState.instance = this;
    }

    public onMouseDown(event: MouseEvent): void {
        // Do nothing
    }

    public onMouseUp(event: MouseEvent): void {
        // Do nothing
    }

    public onMouseMove(event: MouseEvent): void {
        // Do nothing
    }

    public onKeyboardDown(event: KeyboardEvent): void {
        // Do nothing
    }

    public update(delta: number): void {
        // Do nothing
    }

    public enterState(): StartGameState {
        document.body.style.cursor = "default";
        const hudData = this.gameController.getHUDData();
        hudData.sliderDisabled = true;
        hudData.cameraDisabled = true;
        return this;
    }

    public nextState(): IGameState {
        const hudData = this.gameController.getHUDData();
        hudData.sliderDisabled = false;
        hudData.cameraDisabled = false;

        const gameData = this.gameController.getGameData();

        // Choose first player randomly
        if (Math.random() > 0.5) {
            gameData.isPlayerTurn = true;
            return PlayerIdleState.getInstance().enterState();
        } else {
            gameData.isPlayerTurn = false;
            return AIPlayingState.getInstance().enterState();
        }
    }
}
