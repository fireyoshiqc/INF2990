/**
 * hud.component.ts - Implements the heads-up display
 *
 * @authors Pierre To, Mikaël Ferland
 * @date 2017/02/28
 */

import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
    selector: 'my-hud',
    templateUrl: "/assets/templates/hud.component.html"
})

export class HUDComponent {
    private isDarkTheme = false;
    private playerCurlingStones = new Array<number>(8); // Indicates the number of available curling stones for player
    private aiCurlingStones = new Array<number>(8); // Indicates the number of available curling stones for ai
    private selectedSpin = false;
    private rounds = [false, false, false]; // Indicates which rounds have been completed (true)
    private sliderDisabled = false; // False : spin counterclockwise, true : spin clockwiser

    // Data modified in gameControler.service.ts
    @Input() private playerName: string;
    @Input() private aiDifficulty: string;
    @Input() private playerScore = 0;
    @Input() private aiScore = 0;
    @Input() private forceVisible = false;
    @Input() private forceValue = 0;

    @Output()
    private switchCameraEvent: EventEmitter<string> = new EventEmitter();
    @Output()
    private nextRoundEvent: EventEmitter<string> = new EventEmitter();
    @Output()
    private startThrowStoneEvent: EventEmitter<string> = new EventEmitter();

    @HostListener('window:keydown', ['$event'])
    public keyboardInput(event: KeyboardEvent) {
        if (!this.sliderDisabled) {

            if (event.key === "a") {
                this.selectedSpin = false; // Spin antihoraire
            }

            if (event.key === "d") {
                this.selectedSpin = true; // Spin horaire
            }
        }
    }

    public sendSwitchCameraEvent(): void {
        this.switchCameraEvent.emit('camera change');
    }

    public sendNextRoundEvent(): void {
        this.nextRoundEvent.emit('next round + calculate scores');
    }

    public sendThrowStoneEvent(selectedSpin: boolean): void {
        this.startThrowStoneEvent.emit(selectedSpin + "");
    }

    public getTheme(): boolean {
        return this.isDarkTheme;
    }

    public toggleTheme(): void {
        this.isDarkTheme = !this.isDarkTheme;
    }

    public getPlayerName(): string {
        return this.playerName;
    }

    public getAIDDifficulty(): string {
        return this.aiDifficulty;
    }

    public getPlayerScore(): number {
        return this.playerScore;
    }

    public getAIScore(): number {
        return this.aiScore;
    }

    public getForceValue(): number {
        return this.forceValue;
    }

    public setForceValue(newForceValue: number): void {
        this.forceValue = newForceValue;
    }

    public setForceVisibility(newForceVisibility: boolean): void {
        this.forceVisible = newForceVisibility;
    }

    public getRounds(): boolean[] {
        return this.rounds;
    }

    public startNextRound(): void {
        let roundInProgress = this.rounds.findIndex(nextRound => nextRound === false);

        if (roundInProgress !== -1) {
            this.rounds[roundInProgress] = true;
        }
    }

    public getPlayerCurlingStones(): number[] {
        return this.playerCurlingStones;
    }

    public removePlayerCurlingStone(): void {
        this.sliderDisabled = true;
        this.sendThrowStoneEvent(this.selectedSpin);
        this.playerCurlingStones.pop();
    }

    public getAICurlingStones(): number[] {
        return this.aiCurlingStones;
    }

    public removeAICurlingStone(): void {
        this.aiCurlingStones.pop();
    }
}
