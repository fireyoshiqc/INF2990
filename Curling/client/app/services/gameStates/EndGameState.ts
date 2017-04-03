/**
 * EndGameState.ts
 *
 * @authors Vincent Chassé, Erica Bugden et Pierre To
 * @date 2017/04/03
 */

import { IGameState } from './GameState';
import { IdleState } from './IdleState';
import { GameController } from '../gameController.service';
import { GameEngine } from '../gameEngine.service';
import { SceneBuilder } from '../sceneBuilder.service';
import { CurlingStone, Team, SpinOrientation } from '../../entities/curlingStone';

export class EndGameState implements IGameState {

    private static instance: EndGameState = new EndGameState();
    private gameController: GameController;

    public static getInstance(): EndGameState {
        return EndGameState.instance;
    }

    public init(gameController: GameController): void {
        this.gameController = gameController;
    }

    private constructor() {
        if (EndGameState.instance) {
            throw new Error("Error: EndGameState is a singleton class, use EndGameState.getInstance() instead of new.");
        }
        EndGameState.instance = this;
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

    public enterState(): EndGameState {
        const gameData = this.gameController.getGameData();
        const hudData = this.gameController.getHUDData();
        const team = gameData.isPlayerTurn ? Team.Player : Team.AI;
        // TODO détecter joueur gagnant et get ses pierres
        console.log("Dans EndGameState.");
        return this;
    }

    public nextState(): IdleState {
        // TODO: Réinitialiser la partie
        return IdleState.getInstance().enterState();
    }
}
