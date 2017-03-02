/**
 * hud.component.ts - Implements the heads-up display
 *
 * @authors Pierre To, Mikaël Ferland
 * @date 2017/02/28
 */

import { Component, Output, EventEmitter } from '@angular/core';

export enum AIDifficulty {
    Easy,
    Hard
}

@Component({
    selector: 'my-hud',
    templateUrl: "/assets/templates/hud.component.html"
})

export class HUDComponent {
    private isDarkTheme = false;
    private playerCurlingStones = new Array<number>(7); // indicates the number of available curling stones for player
    private aiCurlingStones = new Array<number>(7); // indicates the number of available curling stones for ai
    private playerName = "Nom joueur";
    private aiDifficulty = "CPU facile";
    private playerScore = 0;
    private aiScore = 0;
    private rounds = [false, false, false]; // indicates which rounds have been completed (true)

    @Output()
    switchCameraEvent: EventEmitter<string> = new EventEmitter();
    @Output()
    startThrowStoneEvent: EventEmitter<string> = new EventEmitter();

    sendSwitchCameraEvent() {
        this.switchCameraEvent.emit('camera change');
    }

    sendThrowStoneEvent() {
        this.startThrowStoneEvent.emit('start stone throw');
    }

    getTheme(): boolean {
        return this.isDarkTheme;
    }

    toggleTheme(): void {
        this.isDarkTheme = !this.isDarkTheme;
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

    getPlayerScore(): number {
        return this.playerScore;
    }

    setPlayerScore(newScore: number): void {
        this.playerScore = newScore;
    }

    getAIScore(): number {
        return this.aiScore;
    }

    setAIScore(newScore: number): void {
        this.aiScore = newScore;
    }

    getRounds(): boolean[] {
        return this.rounds;
    }

    startNextRound(): void {
        let roundInProgress = this.rounds.findIndex(nextRound => nextRound === false);

        if (roundInProgress !== -1) {
            this.rounds[roundInProgress] = true;
        }
    }

    getPlayerCurlingStones(): number[] {
        return this.playerCurlingStones;
    }

    removePlayerCurlingStone(): void {
        this.sendThrowStoneEvent();
        this.playerCurlingStones.pop();
    }

    getAICurlingStones(): number[] {
        return this.aiCurlingStones;
    }

    removeAICurlingStone(): void {
        this.aiCurlingStones.pop();

        // TODO : remove
        this.setAIScore(this.aiScore + 1);
    }
}
