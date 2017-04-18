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
    private readonly GRAVITY_N_PER_KG = 9.81;
    private readonly MIN_STONE_JUMP_SPEED = 3;
    private readonly MAX_STONE_JUMP_SPEED = 4;
    private readonly STONE_SPIN_SPEED = 2;
    private animateStones = true;
    private animateConfetti = true;
    private readonly ANIMATION_LENGTH = 5300;
    private stopStonesOnGround = false;
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
        if (this.animateConfetti) {
            let allConfettiOnGround = true;
            this.confettiSystem.forEach((system) => {
                (<THREE.Geometry>system.geometry).vertices.forEach((confetti, index) => {
                    if (confetti.y > 0.002) {
                        confetti.y -= delta * (1.1 + (index % 3 / 4));
                        allConfettiOnGround = false;
                    }
                });
                (<THREE.Geometry>system.geometry).verticesNeedUpdate = true;
            });
            // All confettis are on the ground, stop animation (update)
            if (allConfettiOnGround) {
                this.animateConfetti = false;
            }
        }

        if (this.animateStones) {
            let stonesToRemove: Array<number> = [];
            this.winningStones.forEach((stone, index) => {
                if (stone.isOnGround()) {
                    // Stones can still jump again
                    if (!this.stopStonesOnGround) {
                        // Random jump speed
                        stone.getVelocity().y = Math.random() * (this.MAX_STONE_JUMP_SPEED - this.MIN_STONE_JUMP_SPEED)
                            + this.MIN_STONE_JUMP_SPEED;
                    } else {
                        // Animation over and stone landed, remove from array so it doesnt update
                        stonesToRemove.push(index);
                    }
                } else {
                    stone.getVelocity().y -= this.GRAVITY_N_PER_KG * delta;
                }

                stone.rotateY(this.STONE_SPIN_SPEED * delta);

                stone.update(delta);

                if (stone.position.y <= 0) {
                    stone.position.y = 0;
                }
            });

            if (stonesToRemove.length !== 0) {
                stonesToRemove.reverse();
                // Remove the stones that landed and cant jump again
                stonesToRemove.forEach((index) => {
                    this.winningStones.splice(index, 1);
                });
            }
            // If there are no more stones to update, stop the update
            if (this.winningStones.length === 0) {
                this.animateStones = false;
            }
        }
    }

    public enterState(): EndGameState {
        let self = this;
        self.confettiSystem = [];

        // Detect winning player
        self.setWinningTeam();

        if (this.winningTeam !== undefined) {
            this.gameController.getHUDData().congratulationsMessageVisible = true;
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

            if (this.winningStones === undefined) {
                this.animateStones = false;
            }

        } else {
            // Tie
            this.animateStones = false;
            this.animateConfetti = false;
            self.gameController.getHUDData().tieMessageVisible = true;
        }

        self.timer = setTimeout(() => {
            // End of animation
            self.gameController.getHUDData().congratulationsMessageVisible = false;
            self.gameController.getHUDData().tieMessageVisible = false;
            self.gameController.showHighscores();
            // Make stones not jump again, but let them land
            self.stopStonesOnGround = true;
        }, self.ANIMATION_LENGTH);

        return this;
    }

    public hideConfetti(): void {
        this.confettiSystem.forEach((system) => {
            GameEngine.getInstance().removeFromScene(system);
        });
    }

    public nextState(): PlayerIdleState {
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
