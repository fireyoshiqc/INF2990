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
    private selectedSpin = false; // False : spin counterclockwise, true : spin clockwise

    // Data modified in gameController.service.ts
    @Input() private playerName: string;
    @Input() private aiDifficulty: string;
    @Input() private playerScore: number;
    @Input() private aiScore: number;
    @Input() private playerCurlingStones: number[]; // Indicates the number of available stones for player
    @Input() private aiCurlingStones: number[]; // Indicates the number of available stones for ai
    @Input() private forceVisible: boolean;
    @Input() private forceValue: number;
    @Input() private sliderDisabled = false;
    @Input() private roundsCompleted: boolean[]; // Indicates which rounds have been completed (true)
    @Input() private showNextThrowMessage: boolean;
    @Input() private showNextRoundMessage: boolean;
    @Input() private showEndGameMessage: boolean;

    @Output()
    private switchCameraEvent: EventEmitter<string> = new EventEmitter();
    @Output()
    private startThrowStoneEvent: EventEmitter<string> = new EventEmitter();

    constructor() {
        this.playerName = "";
        this.aiDifficulty = "";
        this.playerScore = 0;
        this.aiScore = 0;
        this.playerCurlingStones = [];
        this.aiCurlingStones = [];
        this.forceVisible = false;
        this.forceValue = 0;
        this.roundsCompleted = [false, false, false];
        this.showNextThrowMessage = false;
        this.showNextRoundMessage = false;
        this.showEndGameMessage = false;
    }

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

    public sendThrowStoneEvent(): void {
        this.startThrowStoneEvent.emit(this.selectedSpin + "");
    }

    public getTheme(): boolean {
        return this.isDarkTheme;
    }

    public toggleTheme(): void {
        this.isDarkTheme = !this.isDarkTheme;
    }
}
