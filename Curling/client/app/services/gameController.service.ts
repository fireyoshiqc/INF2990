/**
 * gameController.service.ts
 *
 * @authors Vincent Chassé et Pierre To
 * @date 2017/02/24
 */

import { Injectable } from '@angular/core';

import { CurlingStone, Team, SpinOrientation } from '../entities/curlingStone';
import { GameRenderer } from './gameRenderer';
import { Rink } from '../entities/rink';
import { IGameState } from './gameStates/GameState';
import { ShootingState } from './gameStates/ShootingState';
import { IdleState } from './gameStates/IdleState';
import { ChoosingAngleState } from './gameStates/ChoosingAngleState';
import { SweepingState } from './gameStates/SweepingState';
import { EndThrowState } from './gameStates/EndThrowState';

export enum AIDifficulty {
    Easy,
    Hard
}

@Injectable()
export class GameController {
    private playerName: string;
    private aiDifficulty: string;
    private playerScore = 0;
    private aiScore = 0;
    private readonly MAX_THROWS = 16;
    private playerCurlingStones = new Array<number>(this.MAX_THROWS / 2); // Number of available stones for player
    private aiCurlingStones = new Array<number>(this.MAX_THROWS / 2); // Number of available stones for ai

    private gameRenderer: GameRenderer;
    private curlingStones: CurlingStone[] = [];

    private idleState = new IdleState(this);
    private shootingState = new ShootingState(this);
    private choosingAngleState = new ChoosingAngleState(this);
    private sweepingState = new SweepingState(this);
    private endThrowState = new EndThrowState(this);
    private gameState: IGameState = this.idleState;

    private shootingAngle: number;
    private sliderDisabled = false;
    private forceVisible = false;
    private forceValue = 0;

    private isPlayerTurn = false;
    private stonesThrown = 0;
    private roundsCompleted = [false, false, false];
    private showNextThrowMessage = false;
    private showNextRoundMessage = false;

    private broomCursorFrame = 1;

    public init(container?: HTMLElement): void {
        this.gameRenderer = new GameRenderer(this.curlingStones, this);
        this.gameRenderer.init(container);

        // Choose first player randomly
        if (Math.random() > 0.5) {
            this.isPlayerTurn = true;
        }

        this.gameRenderer.render();
    }

    public getPlayerName(): string {
        return this.playerName;
    }

    public setPlayerName(name: string): void {
        this.playerName = name;
    }

    public getAIDDifficulty(): AIDifficulty {
        return (this.aiDifficulty === "CPU facile") ? AIDifficulty.Easy : AIDifficulty.Hard;
    }

    public setAIDifficulty(difficulty: AIDifficulty): void {
        this.aiDifficulty = (difficulty === AIDifficulty.Easy) ? "CPU facile" : "CPU difficile";
    }

    public addStone(team: Team, position: THREE.Vector3): void {
        let stone = new CurlingStone(team, new THREE.Vector3(0, 0, 0),
            position.sub(new THREE.Vector3(0, CurlingStone.MAX_RADIUS / 2, 0)));
        stone.init();

        this.curlingStones.push(stone);
        this.gameRenderer.addStone(stone);
    }

    public getCurlingStones(): CurlingStone[] {
        return this.curlingStones;
    }

    public getGameRenderer(): GameRenderer {
        return this.gameRenderer;
    }

    public getPlayerScore(): number {
        return this.playerScore;
    }

    public setPlayerScore(score: number): void {
        this.playerScore = score;
    }

    public getAiScore(): number {
        return this.aiScore;
    }

    public setAiScore(score: number): void {
        this.aiScore = score;
    }

    public getPlayerCurlingStones(): number[] {
        return this.playerCurlingStones;
    }

    public getAICurlingStones(): number[] {
        return this.aiCurlingStones;
    }

    public isForceVisible(): boolean {
        return this.forceVisible;
    }

    public getForceValue(): number {
        return this.forceValue;
    }

    public setForceValue(newForceValue: number): void {
        this.forceValue = newForceValue;
    }

    public getIsPlayerTurn(): boolean {
        return this.isPlayerTurn;
    }

    public setIsPlayerTurn(isPlayerTurn: boolean): void {
        this.isPlayerTurn = isPlayerTurn;
    }

    public getStonesThrown(): number {
        return this.stonesThrown;
    }

    public getShowNextRoundMessage(): boolean {
        return this.showNextRoundMessage;
    }

    public getShowNextThrowMessage(): boolean {
        return this.showNextThrowMessage;
    }

    public getRoundsCompleted(): boolean[] {
        return this.roundsCompleted;
    }

    public onResize(event: any): void {
        this.gameRenderer.onResize(event);
    }

    public switchCamera(): void {
        this.gameRenderer.switchCamera();
    }

    public updateScore(): void {
        if (this.curlingStones.length > 0) {
            let teamClosestStone = this.curlingStones[0].getTeam();
            let index = 0;
            let score = 0;

            // Add points to the closest team for each stone that is inside of the rings
            // And closer to the closest stone from the opposing team (in respect to the curling rules)
            while (this.curlingStones.length > index &&
                this.curlingStones[index].getTeam() === teamClosestStone &&
                this.curlingStones[index].position.distanceTo(Rink.RINGS_CENTER) < Rink.OUTER_RADIUS) {
                score++;
                index++;
            }

            // Update score of closest team
            if (teamClosestStone === Team.Player) {
                this.playerScore += score;
            } else {
                this.aiScore += score;
            }
        }
    }

    public onMousedown(event: any): void {
        this.gameState.onMouseDown(event);
    }

    public onMouseUp(event: any): void {
        this.gameState.onMouseUp(event);
    }

    public onMouseMove(event: any): void {
        this.gameState.onMouseMove(event);
    }

    public onKeyboardDown(event: KeyboardEvent): void {
        this.gameState.onKeyboardDown(event);
    }

    public enterIdleState(): void {
        // Create stone for active player
        document.body.style.cursor = "default";
        if (this.isPlayerTurn) {
            this.addStone(Team.Player, new THREE.Vector3(0, 0, Rink.BACK_LINE / 2));
        } else {
            this.addStone(Team.AI, new THREE.Vector3(0, 0, Rink.BACK_LINE / 2));
        }

        this.gameState = this.idleState;
        this.forceVisible = false;
        this.forceValue = 0;
        this.sliderDisabled = false;
    }

    public startThrowStone(event: any): void {
        if (this.gameState === this.idleState) {
            this.sliderDisabled = true; // Empecher la modification du spin

            if (event === "true") { // Clockwise Spin
                this.curlingStones[this.curlingStones.length - 1].setSpinOrientation(SpinOrientation.CLOCKWISE);
            } else {
                this.curlingStones[this.curlingStones.length - 1].setSpinOrientation(SpinOrientation.COUNTER_CLOCKWISE);
            }

            this.enterChoosingAngleState();
        }
    }

    public enterChoosingAngleState(): void {
        document.body.style.cursor = "none";
        this.gameRenderer.updateDirectionCurve(0);
        this.gameRenderer.showDirectionCurve();
        this.forceVisible = false;
        this.gameState = this.choosingAngleState;
    }

    public enterShootingState(): void {
        this.forceVisible = true;
        this.gameState = this.shootingState;
    }

    public removeThrownStoneFromHUD(): void {
        (this.isPlayerTurn) ? this.playerCurlingStones.pop() : this.aiCurlingStones.pop();
    }

    public enterSweepingState(): void {
        document.body.style.cursor = "url(../assets/textures/balai_rouge.png), auto";
        this.gameRenderer.removeHighlightFromStones();
        this.gameRenderer.hideDirectionCurve();
        this.gameState = this.sweepingState;
    }

    public enterEndThrowState(): void {
        document.body.style.cursor = "default";
        this.gameState = this.endThrowState;
        this.stonesThrown++;
        this.forceVisible = false;

        // Choose player for next throw
        this.isPlayerTurn = !this.isPlayerTurn;

        // Go to next round
        if (this.stonesThrown === this.MAX_THROWS) {
            this.updateScore();
            this.showNextRoundMessage = true;
            this.chooseNextFirstPlayer();
        } else if (this.stonesThrown > 0) { // Go to next throw
            this.showNextThrowMessage = true;
        }
    }

    public chooseNextFirstPlayer(): void {
        // If scores are equal, no changes required (first player for next round is already determined)
        if (this.playerScore > this.aiScore) {
            this.isPlayerTurn = true;
        } else if (this.playerScore < this.aiScore) {
            this.isPlayerTurn = false;
        }
    }

    public startNextThrow(): void {
        this.showNextThrowMessage = false;

        this.enterIdleState();
    }

    public startNextRound(): void {
        // Remove stones from rink
        this.curlingStones.forEach(stone => {
            stone.highlightOff();
            stone.fadeOut();
        });
        this.curlingStones.splice(0);
        this.stonesThrown = 0;

        this.playerCurlingStones = new Array<number>(this.MAX_THROWS / 2);
        this.aiCurlingStones = new Array<number>(this.MAX_THROWS / 2);

        this.showNextRoundMessage = false;

        let roundInProgress = this.roundsCompleted.findIndex(nextRound => nextRound === false);

        if (roundInProgress !== -1) {
            this.roundsCompleted[roundInProgress] = true;
        }

        this.enterIdleState();
    }

    public isInSweepingState(): boolean {
        return this.gameState === this.sweepingState;
    }

    public setShootingAngle(angle: number): void {
        this.shootingAngle = angle;
    }

    public getShootingAngle(): number {
        return this.shootingAngle;
    }

    public getCurrentState(): IGameState {
        return this.gameState;
    }

    public updateBroomCursor(green: boolean) {
        if (green) {
            document.body.style.cursor = "url(../assets/textures/balai_vert"
                + Math.floor(this.broomCursorFrame) + ".png), auto";
            if (this.sweepingState.isSweeping()) {
                if (this.broomCursorFrame < 6) {
                    this.broomCursorFrame += 0.5;
                }
            } else {
                if (this.broomCursorFrame > 1) {
                    this.broomCursorFrame -= 0.5;
                }

            }
            if (!this.sweepingState.getCanSweep()) {
                this.sweepingState.setCanSweep(true);
            }

        }
        else {
            document.body.style.cursor = "url(../assets/textures/balai_rouge.png), auto";
            this.sweepingState.setCanSweep(false);
        }



        if (green && !this.sweepingState.getCanSweep()) {
            document.body.style.cursor = "url(../assets/textures/balai_vert1.png), auto";
            this.sweepingState.setCanSweep(true);

        } else if (!green && this.sweepingState.getCanSweep()) {
            document.body.style.cursor = "url(../assets/textures/balai_rouge.png), auto";
            this.sweepingState.setCanSweep(false);
        }
    }

    public quitGame(): void {
        // Send beacon to server to signal name removal before page unload.
        let blob = new Blob([JSON.stringify({ "name": this.playerName })], { type: 'application/json; charset=UTF-8' });
        navigator.sendBeacon('http://localhost:3002/removeName', blob);
    }

    /******************** TEST HELPER *******************/

    public setStonesForScoringTests(): void {
        this.addStone(Team.Player,
            new THREE.Vector3(Rink.RINGS_CENTER.x, Rink.RINGS_CENTER.y, Rink.RINGS_CENTER.z + 3));
        this.addStone(Team.Player,
            new THREE.Vector3(Rink.RINGS_CENTER.x, Rink.RINGS_CENTER.y, Rink.RINGS_CENTER.z + 2.5));
        this.addStone(Team.Player,
            new THREE.Vector3(Rink.RINGS_CENTER.x, Rink.RINGS_CENTER.y, Rink.RINGS_CENTER.z + 2));
        this.addStone(Team.Player,
            new THREE.Vector3(Rink.RINGS_CENTER.x, Rink.RINGS_CENTER.y, Rink.RINGS_CENTER.z + 1));
        this.addStone(Team.AI,
            new THREE.Vector3(Rink.RINGS_CENTER.x, Rink.RINGS_CENTER.y, Rink.RINGS_CENTER.z + 3.5));
        this.addStone(Team.AI,
            new THREE.Vector3(Rink.RINGS_CENTER.x, Rink.RINGS_CENTER.y, Rink.RINGS_CENTER.z + 1.5));
        this.addStone(Team.AI,
            new THREE.Vector3(Rink.RINGS_CENTER.x, Rink.RINGS_CENTER.y, Rink.RINGS_CENTER.z + 0.5));
        this.addStone(Team.AI, Rink.RINGS_CENTER);
    }

    public resetStones(): void {
        this.curlingStones.splice(0);
    }

    /***************** END TEST HELPER *******************/
}
