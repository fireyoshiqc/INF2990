/**
 * EndGameState.ts
 *
 * @authors Vincent Chassé, Erica Bugden et Pierre To
 * @date 2017/04/03
 */

import { IGameState } from './GameState';
import { PlayerIdleState } from './PlayerIdleState';
import { GameController } from '../gameController.service';
import { GameEngine } from '../gameEngine.service';
import { CurlingStone, Team } from '../../entities/curlingStone';

export class EndGameState implements IGameState {
    private static instance: EndGameState = new EndGameState();
    private readonly ANIMATION_LENGTH = 5000;
    private gameController: GameController;
    private winningStones: Array<CurlingStone>;
    private timer : any;

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
        // TODO make the winning stones jump and call confetti
    }

    public enterState(): EndGameState {
        // Detect winning player and get their stones
        this.initWinningStones();
        // TODO initialize the confetti
        this.timer = setTimeout(() => {
            // End of animation
        }, this.ANIMATION_LENGTH);

        console.log("Dans EndGameState.");
        return this;
    }

    public nextState(): PlayerIdleState {
        // TODO: Réinitialiser la partie
        return PlayerIdleState.getInstance().enterState();
    }

    private initWinningStones(): void {
        const gameData = this.gameController.getGameData();
        let winningTeam = (gameData.playerScore > gameData.aiScore) ? Team.Player : Team.AI;
        this.winningStones = GameEngine.getInstance().getStones().filter(stone => stone.getTeam() === winningTeam);
    }
}
