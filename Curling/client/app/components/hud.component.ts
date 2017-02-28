/**
 * hud.service.ts - Implements the heads-up display
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
    private playerCurlingStones = new Array<number>(7);
    private aiCurlingStones = new Array<number>(7);
    private playerName = "Nom joueur";
    private aiDifficulty = "CPU facile";
    private playerScore = 0;
    private aiScore = 0;
    private rounds = [true, false, false];

    @Output()
    switchCameraEvent: EventEmitter<string> = new EventEmitter();

    sendSwitchCameraEvent() {
        this.switchCameraEvent.emit('switchCameraEvent');
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
    }

    setPlayerName(name: string): void {
        this.playerName = name;
    }

    setAIDifficulty(difficulty: AIDifficulty): void {
        this.aiDifficulty = (difficulty === AIDifficulty.Easy) ? "CPU facile" : "CPU difficile";
    }

    setPlayerScore(newScore: number): void {
        this.playerScore = newScore;
    }

    setAIScore(newScore: number): void {
        this.aiScore = newScore;
    }

    startNextRound(): void {
        let roundInProgress = this.rounds.findIndex(nextRound => nextRound === false);

        if (roundInProgress !== -1) {
            this.rounds[roundInProgress] = true;
        }
    }

    removePlayerCurlingStone(): void {
        this.playerCurlingStones.pop();

        // TODO : remove
        this.setPlayerScore(this.playerScore + 1);
    }

    removeAICurlingStone(): void {
        this.aiCurlingStones.pop();

        // TODO : remove
        this.setAIScore(this.aiScore + 1);
    }
}
