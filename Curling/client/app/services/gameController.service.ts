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

export enum AIDifficulty {
    Easy,
    Hard
}

@Injectable()
export class GameController {
    private playerName: string;
    private aiDifficulty: string;

    private gameRenderer: GameRenderer;
    private curlingStones: CurlingStone[] = [];
    private playerScore = 0;
    private aiScore = 0;
    private shootingAngle: number;

    private idleState = new IdleState(this);
    private shootingState = new ShootingState(this);
    private choosingAngleState = new ChoosingAngleState(this);
    private sweepingState = new SweepingState(this);
    private gameState: IGameState = this.idleState;

    private sliderDisabled = false;
    private forceVisible = false;
    private forceValue = 0;

    private isPlayerTurn = false;

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

    public addStone(team: Team, position: THREE.Vector3) {
        let stone = new CurlingStone(team, new THREE.Vector3(0, 0, 0), position);
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

    public getAiScore(): number {
        return this.aiScore;
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

    public onResize(event: any): void {
        this.gameRenderer.onResize(event);
    }

    public switchCamera(): void {
        this.gameRenderer.switchCamera();
    }

    public updateScore(): void {
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

    public onMousedown(event: any) {
        this.gameState.onMouseDown(event);
    }

    public onMouseUp(event: any) {
        this.gameState.onMouseUp(event);
    }

    public onMouseMove(event: any) {
        this.gameState.onMouseMove(event);
    }

    public enterIdleState() {
        // Generer la pierre
        if (this.isPlayerTurn) {
            this.addStone(Team.Player, new THREE.Vector3(0, 0, 0));
        } else {
            this.addStone(Team.AI, new THREE.Vector3(0, 0, 0));
        }

        // Changer de tour
        this.isPlayerTurn = !this.isPlayerTurn;

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

    public enterChoosingAngleState() {
        document.body.style.cursor = "none";
        this.gameRenderer.updateDirectionCurve(0);
        this.gameRenderer.showDirectionCurve();
        this.forceVisible = false;
        this.gameState = this.choosingAngleState;
    }

    public enterShootingState() {
        this.forceVisible = true;
        this.gameState = this.shootingState;
    }

    public enterSweepingState() {
        document.body.style.cursor = "default";
        this.gameRenderer.removeHighlightFromStones();
        this.gameRenderer.hideDirectionCurve();
        this.gameState = this.sweepingState;
    }

    public isInSweepingState() {
        return this.gameState === this.sweepingState;
    }

    public setShootingAngle(angle: number) {
        this.shootingAngle = angle;
    }

    public getShootingAngle(): number {
        return this.shootingAngle;
    }

    public getCurrentState(): IGameState {
        return this.gameState;
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
        this.curlingStones = [];
    }

    /***************** END TEST HELPER *******************/
}
