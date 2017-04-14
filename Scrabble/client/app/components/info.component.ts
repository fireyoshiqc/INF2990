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
    hasQuitAfterGameEnd?: boolean;
}

@Component({
    moduleId: module.id,
    selector: 'info-comp',
    templateUrl: '/assets/templates/info.component.html'
})

export class InfoComponent {
    private players: IPlayerInfo[];
    private time: string;
    private activePlayerName: string;
    private nLettersStash: number;
    private player: Player;
    private gameOver: boolean;
    private winningPlayers: string;

    constructor() {
        this.players = [{}];
        this.time = "";
        this.activePlayerName = "";
        this.nLettersStash = 0;
        this.player = PlayerHandler.requestPlayer();
        this.gameOver = false;
        this.winningPlayers = "";
    }

    public getPlayer(): Player {
        return this.player;
    }

    public updateTurnInfo(turnInfo: ITurnInfo): void {
        this.time = turnInfo.minutes.toString();
        (turnInfo.seconds < 10) ?
            this.time += ":0" + turnInfo.seconds.toString() : this.time += ":" + turnInfo.seconds.toString();
        this.activePlayerName = turnInfo.activePlayerName;
        this.nLettersStash = turnInfo.nLettersStash;

        // Check if a player has left
        if (this.players.length > turnInfo.players.length) {
            this.players = this.players.slice(0, turnInfo.players.length);
        }

        // Update info for each player
        for (let i = 0; i < turnInfo.players.length; i++) {
            this.players[i] = {
                name: turnInfo.players[i].name,
                score: turnInfo.players[i].score,
                rackLettersCount: turnInfo.players[i].rackLettersCount,
                hasQuitAfterGameEnd: turnInfo.players[i].hasQuitAfterGameEnd
            };
        }

        if (turnInfo.gameOver) {
            this.gameOver = turnInfo.gameOver;
            this.winningPlayers = this.getWinners();
        }
    }

    private getWinners(): string {
        // 1- Retrive player(s) with highest score
        let maxScore = this.getHighestScore();
        let winningPlayers = this.players.filter(player => player.score === maxScore);

        // 2- Build string with player names (to be displayed)
        let winningPlayersString = "";
        winningPlayers.forEach(player => {
            winningPlayersString += player.name + ", ";
        });
        winningPlayersString = winningPlayersString.substring(0, winningPlayersString.length - 2);

        return winningPlayersString;
    }

    private getHighestScore(): number {
         return Math.max.apply(Math, this.players.map(player => player.score));
    }

    // For tests
    public getTurnInfo(): ITurnInfo {
        return {
            minutes: parseInt(this.time.substr(0, this.time.indexOf(":")), 10),
            seconds: parseInt(this.time.substr(this.time.indexOf(":") + 1, this.time.length - 1), 10),
            activePlayerName: this.activePlayerName,
            players: this.players
        };
    }

    // Returns a value between 0 and 100 for the infopanel progress bar to display the remaining time.
    public getTimeProgress() : number {
        const info = this.getTurnInfo();
        const maxTime = 300; // 5 minutes * 60 seconds
        return ((info.minutes * 60 + info.seconds) / maxTime) * 100;
    }

    public isGameOver(): boolean {
        return this.gameOver;
    }
}
