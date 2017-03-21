/**
 * info.component.ts
 *
 * @authors Félix Boulet, Pierre To
 * @date 2017/02/12
 */

import { Component } from '@angular/core';

export interface ITurnInfo {
    minutes: number;
    seconds: number;
    activePlayerName: string;
}

@Component({
    moduleId: module.id,
    selector: 'info-comp',
    templateUrl: '/assets/templates/info.component.html'
})

export class InfoComponent {
    private minutes: number;
    private seconds: number;
    private activePlayerName: string;

    constructor() {
        this.minutes = 0;
        this.seconds = 0;
        this.activePlayerName = "";
    }

    public updateTurnInfo(turnInfo: ITurnInfo): void {
        if (this.minutes !== turnInfo.minutes) {
            this.minutes = turnInfo.minutes;
        }
        if (this.seconds !== turnInfo.seconds) {
            this.seconds = turnInfo.seconds;
        }
        if (this.activePlayerName !== turnInfo.activePlayerName) {
            this.activePlayerName = turnInfo.activePlayerName;
        }
    }

    // For tests
    public getTurnInfo(): ITurnInfo {
        return {
            minutes: this.minutes,
            seconds: this.seconds,
            activePlayerName: this.activePlayerName
        };
    }
}
