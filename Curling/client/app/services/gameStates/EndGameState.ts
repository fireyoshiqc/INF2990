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
import { SceneBuilder } from '../sceneBuilder.service';
import { CurlingStone, Team } from '../../entities/curlingStone';

export class EndGameState implements IGameState {
    private static instance: EndGameState = new EndGameState();
    private readonly ANIMATION_LENGTH = 5000;
    private confettiSystem: THREE.Points;
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
        // TODO make the winning stones jump and animate confetti
    }

    public enterState(): EndGameState {
        let self = this;
        // Detect winning player
        self.setWinningTeam();

        // Add highscore if the player wins
        if (self.winningTeam === Team.Player) {
            self.gameController.addHighscore()
                .then(() => {
                    self.gameController.showHighscores();
                })
                .catch((err) => {
                    throw new Error("Error: Could not add highscore!");
                });
        } else {
            // Directly show highscores
            self.gameController.showHighscores();
        }

        // Get their stones
        self.winningStones = GameEngine.getInstance().getStones().filter(stone => stone.getTeam() === self.winningTeam);
        SceneBuilder.getInstance().buildConfettiSystem()
            .then((confettiSystem) => {
                self.confettiSystem = confettiSystem;
                GameEngine.getInstance().addToScene(self.confettiSystem);
            });
        self.timer = setTimeout(() => {
            // End of animation
        }, self.ANIMATION_LENGTH);

        return self;
    }

    public hideConfetti(): void {
        GameEngine.getInstance().removeFromScene(this.confettiSystem);
    }

    public nextState(): PlayerIdleState {
        // TODO: Réinitialiser la partie
        this.hideConfetti();
        return PlayerIdleState.getInstance().enterState();
    }

    private setWinningTeam(): void {
        const gameData = this.gameController.getGameData();
        this.winningTeam = (gameData.playerScore > gameData.aiScore) ? Team.Player : Team.AI;
    }
}
