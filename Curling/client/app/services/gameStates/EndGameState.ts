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
    private winningTeam: Team;
    private winningStones: Array<CurlingStone>;
    private timer: any;

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

        // Detect winning player
        this.setWinningTeam();

        // Add highscore if the player wins
        if (this.winningTeam === Team.Player) {
            this.gameController.addHighscore()
            .then( () => {
                this.gameController.showHighscores();
            })
            .catch((err) => {
                throw new Error("Error: Could not add highscore!");
            } );
        } else {
            // Directly show highscores
            this.gameController.showHighscores();
        }

        // Get their stones
        this.winningStones = GameEngine.getInstance().getStones().filter(stone => stone.getTeam() === this.winningTeam);
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

    private setWinningTeam(): void {
        const gameData = this.gameController.getGameData();
        this.winningTeam = (gameData.playerScore > gameData.aiScore) ? Team.Player : Team.AI;
    }
}
