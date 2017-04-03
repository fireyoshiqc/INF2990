/**
 * EndThrowState.ts
 *
 * @authors Pierre To
 * @date 2017/03/22
 */

import { IGameState } from './GameState';
import { IdleState } from './IdleState';
import { EndGameState } from './EndGameState';
import { GameController } from '../gameController.service';
import { GameEngine } from '../gameEngine.service';
import { SceneBuilder } from '../sceneBuilder.service';
import { Team } from '../../entities/curlingStone';

export class EndThrowState implements IGameState {

    private static instance: EndThrowState = new EndThrowState();
    private gameController: GameController;
    private stonesThrown = 0;

    public static getInstance(): EndThrowState {
        return EndThrowState.instance;
    }

    public init(gameController: GameController): void {
        this.gameController = gameController;
    }

    private constructor() {
        if (EndThrowState.instance) {
            throw new Error("Error: EndThrowState " +
                "is a singleton class, use EndThrowState.getInstance() instead of new.");
        }
        EndThrowState.instance = this;
    }

    public onMouseDown(event: any): void {
        if (this.gameController.getHUDData().nextThrowMessageVisible) {
            this.gameController.getGameData().state = this.nextState();
        }

        if (this.gameController.getHUDData().nextRoundMessageVisible) {
            this.gameController.getGameData().state = this.nextState();
            this.startNextRound();
        }
    }

    public onMouseUp(event: any): void {
        // Do nothing
    }

    public onMouseMove(event: any): void {
        // Do nothing
    }

    public onKeyboardDown(event: KeyboardEvent): void {
        if (event.key === " ") { // Spacebar
            if (this.gameController.getHUDData().nextThrowMessageVisible) {
                this.gameController.getGameData().state = this.nextState();
            }

            if (this.gameController.getHUDData().nextRoundMessageVisible) {
                this.startNextRound();
            }
        }
    }

    public update(delta: number): void {
        // Do nothing
    }

    public enterState(): EndThrowState {

        document.body.style.cursor = "default";

        this.stonesThrown++;

        let hudData = this.gameController.getHUDData();
        let gameData = this.gameController.getGameData();

        hudData.forceVisible = false;

        let roundEnd = false;

        if (this.stonesThrown === this.gameController.getMaxThrows()) {
            roundEnd = true;
            this.countAndHighlightPoints(roundEnd);

            if (gameData.roundsCompleted[1]) {
                // Enter EndGameState if game is over
                gameData.roundsCompleted[2] = true;
                this.gameController.getGameData().state = EndGameState.getInstance().enterState();
            } else {
                hudData.nextRoundMessageVisible = true;
                hudData.nextThrowMessageVisible = false;
            }
        } else {
            hudData.nextRoundMessageVisible = false;
            hudData.nextThrowMessageVisible = true;
            this.countAndHighlightPoints(roundEnd);
        }


        return this;
    }

    public nextState(): IdleState {
        this.gameController.getHUDData().nextThrowMessageVisible = false;
        this.gameController.getHUDData().nextRoundMessageVisible = false;

        return IdleState.getInstance().enterState();
    }

    // Highlight stones that are currently worth points
    private countAndHighlightPoints(roundEnd: boolean): void {

        let curlingStones = GameEngine.getInstance().getStones();
        let rings = SceneBuilder.getInstance().getRinkData().rings;

        let gameData = this.gameController.getGameData();

        if (curlingStones.length > 0) {

            let teamClosestStone = curlingStones[0].getTeam();
            let index = 0;

            const ringsCenter = new THREE.Vector3(0, 0, rings.offset);

            let score = 0;

            while (curlingStones.length > index &&
                curlingStones[index].getTeam() === teamClosestStone &&
                curlingStones[index].position.distanceTo(ringsCenter) < rings.outer) {
                score++;
                curlingStones[index++].highlightOn();
            }

            // Don't add points yet if it's not the end of the round.
            if (roundEnd) {
                // Update score of closest team
                teamClosestStone === Team.Player ? gameData.playerScore += score : gameData.aiScore += score;
                this.chooseNextFirstPlayer(teamClosestStone, score);
            }
        }

        if (!roundEnd) {
            gameData.isPlayerTurn = !gameData.isPlayerTurn;
        }
    }

    private chooseNextFirstPlayer(teamClosestStone: Team, score: number): void {
        // If round is null, no changes required (first player for next round is already determined)
        if (score !== 0) {
            // Player with highest score in the round goes first in the next round
            this.gameController.getGameData().isPlayerTurn = (teamClosestStone === Team.Player);
        }
    }

    private startNextRound(): void {
        const gameData = this.gameController.getGameData();
        const hudData = this.gameController.getHUDData();
        let curlingStones = GameEngine.getInstance().getStones();
        curlingStones.forEach(stone => {
            GameEngine.getInstance().removeFromScene(stone);
        });

        curlingStones.splice(0);
        this.stonesThrown = 0;
        hudData.playerStones = new Array<number>(this.gameController.getMaxThrows() / 2);
        hudData.aiStones = new Array<number>(this.gameController.getMaxThrows() / 2);

        const roundInProgress = gameData.roundsCompleted.findIndex(nextRound => nextRound === false);

        if (roundInProgress !== -1) {
            gameData.roundsCompleted[roundInProgress] = true;
        }

        this.gameController.getGameData().state = this.nextState();

        /**
         * Go to end game´
         * const gameData = this.gameController.getGameData();
         * if (this.stonesThrown === this.gameController.getMaxThrows() && gameData.roundsCompleted[1]) {
         * this.endGame();
         * } else if (this.stonesThrown === this.gameController.getMaxThrows()) { // Go to next round
         * this.updateScore();
         * this.showNextRoundMessage = true;
         * } else if (this.stonesThrown > 0) { // Go to next throw
         * this.showNextThrowMessage = true;
         * }
         */
    }
}
