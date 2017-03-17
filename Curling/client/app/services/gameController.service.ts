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
import { GameState } from './gameStates/GameState';
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
    private gameState: GameState = this.idleState;

    private forceVisible = false;
    private forceValue = 0;

    public init(container?: HTMLElement): void {
        this.gameRenderer = new GameRenderer(this.curlingStones, this);
        this.gameRenderer.init(container);

        CurlingStone.setPlayerStoneColor("#FFFFFF");

        // TODO : Lancement des pierres de curling
        this.addStone(Team.Player, new THREE.Vector3(0, 0, 0));
        this.gameRenderer.render();
    }

    getPlayerName(): string {
        return this.playerName;
    }

    setPlayerName(name: string): void {
        this.playerName = name;
    }

    getAIDDifficulty(): AIDifficulty {
        return (this.aiDifficulty === "CPU facile") ? AIDifficulty.Easy : AIDifficulty.Hard;
    }

    setAIDifficulty(difficulty: AIDifficulty): void {
        this.aiDifficulty = (difficulty === AIDifficulty.Easy) ? "CPU facile" : "CPU difficile";
    }

    addStone(team: Team, position: THREE.Vector3) {
        let stone = new CurlingStone(team, new THREE.Vector3(0, 0, 0), position);
        stone.init();

        this.curlingStones.push(stone);
        this.gameRenderer.addStone(stone);
    }

    getCurlingStones(): CurlingStone[] {
        return this.curlingStones;
    }

    getGameRenderer(): GameRenderer {
        return this.gameRenderer;
    }

    getPlayerScore(): number {
        return this.playerScore;
    }

    getAiScore(): number {
        return this.aiScore;
    }

    isForceVisible(): boolean {
        return this.forceVisible;
    }

    getForceValue(): number {
        return this.forceValue;
    }

    setForceValue(newForceValue: number): void {
        this.forceValue = newForceValue;
    }

    onResize(event: any): void {
        this.gameRenderer.onResize(event);
    }

    switchCamera(): void {
        this.gameRenderer.switchCamera();
    }

    updateScore(): void {
        let teamClosestStone = this.curlingStones[0].getTeam();
        let index = 0;
        let score = 0;

        // add points to the closest team for each stone that is inside of the rings
        // and closer to the closest stone from the opposing team (in respect to the curling rules)
        while (this.curlingStones.length > index &&
               this.curlingStones[index].getTeam() === teamClosestStone &&
               this.curlingStones[index].position.distanceTo(Rink.RINGS_CENTER) < Rink.OUTER_RADIUS) {
            score++;
            index++;
        }

        // update score of closest team
        if (teamClosestStone === Team.Player) {
            this.playerScore += score;
        } else {
            this.aiScore += score;
        }
    }

    onMousedown(event: any) {
        this.gameState.onMouseDown(event);
    }

    onMouseUp(event: any) {
        this.gameState.onMouseUp(event);
    }

    onMouseMove(event: any) {
        this.gameState.onMouseMove(event);
    }

    enterChoosingAngleState() {
        document.body.style.cursor = "none";
        this.gameRenderer.updateDirectionCurve(0);
        this.gameRenderer.showDirectionCurve();
        this.gameState = this.choosingAngleState;
    }

    enterShootingState() {
        this.forceVisible = true;
        this.gameState = this.shootingState;
    }

    enterSweepingState() {
        document.body.style.cursor = "default";
        this.gameRenderer.removeHighlightFromStones();
        this.gameRenderer.hideDirectionCurve();
        this.gameState = this.sweepingState;
    }

    isInSweepingState() {
        return this.gameState === this.sweepingState;
    }

    enterIdleState() {
        this.gameState = this.idleState;
        this.forceVisible = false;
    }

    startThrowStone(event: any): void {
        if (this.gameState === this.idleState) {
            if (event === "true") { //Clockwise Spin
                this.curlingStones[this.curlingStones.length - 1].setSpinOrientation(SpinOrientation.CLOCKWISE);
            } else {
                this.curlingStones[this.curlingStones.length - 1].setSpinOrientation(SpinOrientation.COUNTER_CLOCKWISE);
            }

            this.enterChoosingAngleState();
        }
    }

    setShootingAngle(angle: number) {
        this.shootingAngle = angle;
    }

    getShootingAngle(): number {
        return this.shootingAngle;
    }

    getCurrentState(): GameState {
        return this.gameState;
    }

    quitGame(): void {
        //Send beacon to server to signal name removal before page unload.
        let blob = new Blob([JSON.stringify({"name": this.playerName})], {type: 'application/json; charset=UTF-8'});
        navigator.sendBeacon('http://localhost:3002/removeName', blob);
    }

    /******************** TEST HELPER *******************/

    setStonesForScoringTests(): void {
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

    resetStones(): void {
        this.curlingStones = this.curlingStones.slice(0, 1);
    }

    /***************** END TEST HELPER *******************/
}
