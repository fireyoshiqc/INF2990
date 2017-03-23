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
    players: IPlayerInfo[];
    nLettersStash?: number;
}

export interface IPlayerInfo {
    name?: string;
    score?: number;
    nRackLetters?: number;
}

@Component({
    moduleId: module.id,
    selector: 'info-comp',
    templateUrl: '/assets/templates/info.component.html'
})

export class InfoComponent {
    private players: IPlayerInfo[];
    private minutes: number;
    private seconds: number;
    private activePlayerName: string;
    private nLettersStash: number;
    private thisPlayer: string;

    constructor() {
        this.players = [{}];
        this.minutes = 0;
        this.seconds = 0;
        this.activePlayerName = "";
        this.nLettersStash = 0;
        this.thisPlayer = "";
    }

    // The multitude of ifs is to prevent unecessary data refreshsing which causes flashing
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

        if (this.nLettersStash !== turnInfo.nLettersStash) {
            this.nLettersStash = turnInfo.nLettersStash;
        }

        // Check if a player has left
        if (this.players.length > turnInfo.players.length) {
            this.players = this.players.slice(0, turnInfo.players.length);
        }

        // Update info for each player
        for (let i = 0; i < turnInfo.players.length; i++) {
            this.players[i] = {
                name: turnInfo.players[i].name,
                score: turnInfo.players[i].score,
                nRackLetters: turnInfo.players[i].nRackLetters
            };
        }
    }

    public updateName(name: string) {
        this.thisPlayer = name;
    }

    // For tests
    public getTurnInfo(): ITurnInfo {
        return {
            minutes: this.minutes,
            seconds: this.seconds,
            activePlayerName: this.activePlayerName,
            players: this.players
        };
    }
}
