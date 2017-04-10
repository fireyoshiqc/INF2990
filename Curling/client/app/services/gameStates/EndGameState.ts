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
    private readonly TOTAL_CONFETTI_COUNT = 1000;
    private readonly colorArray = [0x00FFFF, 0xFF00FF, 0xFFFF00, 0x9400D3, 0xFFA500];
    private confettiSystem: Array<THREE.Points>;
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
        this.confettiSystem.forEach((system) => {
            (<THREE.Geometry>system.geometry).vertices.forEach((confetti, index) => {
                if (confetti.y > 0.002) {
                    confetti.y -= delta * (1 + (index % 3 / 4));
                }
            });
            (<THREE.Geometry>system.geometry).verticesNeedUpdate = true;
        });
    }

    public enterState(): EndGameState {
        let self = this;
        self.confettiSystem = [];
        // Detect winning player
        self.setWinningTeam();
        if (this.winningTeam !== undefined) {
            GameEngine.getInstance().removeHighlightOnAllStones();
            // Add highscore if the player wins
            if (self.winningTeam === Team.Player) {
                self.gameController.addHighscore()
                    .catch((err) => {
                        throw new Error("Error: Could not add highscore!");
                    });
            }

            // Get their stones
            self.winningStones = GameEngine.getInstance().getStones().filter(stone =>
                stone.getTeam() === self.winningTeam);
            this.colorArray.forEach((color) => {
                SceneBuilder.getInstance().buildConfettiSystem(
                    color,
                    this.TOTAL_CONFETTI_COUNT / this.colorArray.length)
                    .then((confettiSystem) => {
                        self.confettiSystem.push(confettiSystem);
                        GameEngine.getInstance().addToScene(confettiSystem);
                    });
            });

            self.timer = setTimeout(() => {
                // End of animation
                self.gameController.showHighscores();
            }, self.ANIMATION_LENGTH);
        } else {
            // Égalité
            alert("égalité");
        }

        return this;
    }

    public hideConfetti(): void {
        this.confettiSystem.forEach((system) => {
            GameEngine.getInstance().removeFromScene(system);
        });
    }

    public nextState(): PlayerIdleState {
        // TODO: Réinitialiser la partie
        this.hideConfetti();
        return PlayerIdleState.getInstance().enterState();
    }

    private setWinningTeam(): void {
        const gameData = this.gameController.getGameData();
        let scoreDiff = gameData.playerScore - gameData.aiScore;
        if (scoreDiff !== 0) {
            this.winningTeam = (scoreDiff > 0) ? Team.Player : Team.AI;
        } // Pas oublier de set winningteam à undefined à la fin (pas ici)
    }
}
