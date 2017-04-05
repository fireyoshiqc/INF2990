/**
 * info.component.ts
 *
 * @authors Félix Boulet, Pierre To
 * @date 2017/02/12
 */

import { Component } from '@angular/core';
import { PlayerHandler } from '../modules/playerHandler.module';
import { Player } from '../classes/player';

export interface ITurnInfo {
    minutes: number;
    seconds: number;
    activePlayerName: string;
    players: IPlayerInfo[];
    nLettersStash?: number;
    gameOver?: boolean;
}

export interface IPlayerInfo {
    name?: string;
    score?: number;
    rackLettersCount?: number;
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
    private player: Player;
    private gameOver: boolean;
    private winningPlayer: string;

    constructor() {
        this.players = [{}];
        this.minutes = 0;
        this.seconds = 0;
        this.activePlayerName = "";
        this.nLettersStash = 0;
        this.player = PlayerHandler.requestPlayer();
    }

    public getPlayer(): Player {
        return this.player;
    }

    public updateTurnInfo(turnInfo: ITurnInfo): void {
        this.minutes = turnInfo.minutes;
        this.seconds = turnInfo.seconds;
        this.activePlayerName = turnInfo.activePlayerName;
        this.nLettersStash = turnInfo.nLettersStash;
        this.gameOver = turnInfo.gameOver;

        if (this.gameOver) {
            this.winningPlayer = this.getWinner();
            console.log("Game is over!");
            console.log("Winning player: " + this.winningPlayer);
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
                rackLettersCount: turnInfo.players[i].rackLettersCount
            };
        }
    }

    private getWinner(): string {
        // TODO deal with case where multiple players have same score
        let maxScore = Math.max.apply(Math, this.players.map(player => player.score));
        let winningPlayer = this.players.find(player => player.score === maxScore).name;
        return winningPlayer;
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
