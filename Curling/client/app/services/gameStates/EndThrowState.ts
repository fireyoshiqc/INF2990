/**
 * EndThrowState.ts
 *
 * @authors Pierre To
 * @date 2017/03/22
 */

import { IGameState } from './GameState';
import { PlayerIdleState } from './PlayerIdleState';
import { EndGameState } from './EndGameState';
import { AIPlayingState } from './AIPlayingState';
import { GameController } from '../gameController.service';
import { GameEngine } from '../gameEngine.service';
import { SceneBuilder } from '../sceneBuilder.service';
import { CurlingStone, Team } from '../../entities/curlingStone';

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

    public nextState(): IGameState {
        this.gameController.getHUDData().nextThrowMessageVisible = false;
        this.gameController.getHUDData().nextRoundMessageVisible = false;

        return this.gameController.getGameData().isPlayerTurn ?
            PlayerIdleState.getInstance().enterState() :
            AIPlayingState.getInstance().enterState();
    }

    // Highlight stones that are currently worth points
    private countAndHighlightPoints(roundEnd: boolean): void {
        let curlingStones = GameEngine.getInstance().getStones();
        let teamClosestStone: Team;
        let points = 0;

        if (curlingStones.length > 0) {
            // CurlingStones are sorted by distance to the center of rings
            // Scoring team is always the closest stone, the first stone in curlingStones
            teamClosestStone = curlingStones[0].getTeam();

            // Count points and highlight stones worth points
            let index = 0;
            while (curlingStones.length > index && this.isStoneWorthPoint(curlingStones[index], teamClosestStone)) {
                points++;
                curlingStones[index++].highlightOn();
            }
        }

        // Don't add points yet if it's not the end of the round.
        if (roundEnd) {
            this.addPoints(teamClosestStone, points);
            this.chooseNextFirstPlayer(teamClosestStone, points);
        } else {
            let gameData = this.gameController.getGameData();
            gameData.isPlayerTurn = !gameData.isPlayerTurn;
        }
    }

    private isStoneWorthPoint(stone: CurlingStone, teamClosestStone: Team): boolean {
        let rings = SceneBuilder.getInstance().getRinkData().rings;
        const ringsCenter = new THREE.Vector3(0, 0, rings.offset);

        // Check if teamClosestStone has stones in house (worth point)
        return (stone.getTeam() === teamClosestStone &&
                stone.position.distanceTo(ringsCenter) < rings.outer);
    }

    private addPoints(teamClosestStone: Team, points: number): void  {
        let gameData = this.gameController.getGameData();

        // Update score of closest team with stones in house
        if (teamClosestStone !== undefined) {
            teamClosestStone === Team.Player ? gameData.playerScore += points : gameData.aiScore += points;
        }
    }

    private chooseNextFirstPlayer(teamClosestStone: Team, points: number): void {
        let gameData = this.gameController.getGameData();

        // If round is null, first player for next round is the one who started the current round
        // Round is null if the teamClosestStone is undefined (when all stones were out of bounds during a round)
        // Round is null if the teamClosestStone is defined, but their score is 0 because they have no stone in house
        if (teamClosestStone === undefined || points === 0) {
            gameData.isPlayerTurn = !gameData.isPlayerTurn;
        } else {
            // Player with highest score in the round goes first in the next round
            gameData.isPlayerTurn = (teamClosestStone === Team.Player);
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
