/**
 * hud.component.ts - Implements the heads-up display
 *
 * @authors Pierre To, Mikaël Ferland
 * @date 2017/02/28
 */

import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

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
    @Input() private playerScore = 0; // data modified in gameControler.service.ts
    @Input() private aiScore = 0; // data modified in gameControler.service.ts
    private selectedSpin = false;
    private rounds = [false, false, false]; // indicates which rounds have been completed (true)
    private sliderDisabled = false;

    @Output()
    switchCameraEvent: EventEmitter<string> = new EventEmitter();
    @Output()
    nextRoundEvent: EventEmitter<string> = new EventEmitter();
    @Output()
    startThrowStoneEvent: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keydown', ['$event'])
    keyboardInput(event: KeyboardEvent) {
        if (!this.sliderDisabled) {

            if (event.key === "a") {
                this.selectedSpin = false; // Spin antihoraire
            }

            if (event.key === "d") {
                this.selectedSpin = true; // Spin horaire
            }
        }
    }

    sendSwitchCameraEvent(): void {
        this.switchCameraEvent.emit('camera change');
    }

    sendNextRoundEvent(): void {
        this.nextRoundEvent.emit('next round + calculate scores');
    }

    sendThrowStoneEvent(selectedSpin: boolean): void {
        this.startThrowStoneEvent.emit(selectedSpin + "");
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
        this.sliderDisabled = true;
        this.sendThrowStoneEvent(this.selectedSpin);
        this.playerCurlingStones.pop();
    }

    getAICurlingStones(): number[] {
        return this.aiCurlingStones;
    }

    removeAICurlingStone(): void {
        this.aiCurlingStones.pop();
    }
}
