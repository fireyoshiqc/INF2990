/**
 * gameController.service.ts
 *
 * @authors Vincent Chassé et Pierre To
 * @date 2017/02/24
 */

import { Injectable } from '@angular/core';
import { GameEngine } from './gameEngine.service';
import { IGameState } from './gameStates/GameState';
import { ChoosingAngleState } from './gameStates/ChoosingAngleState';
import { EndThrowState } from './gameStates/EndThrowState';
import { IdleState } from './gameStates/IdleState';
import { ShootingState } from './gameStates/ShootingState';
import { SweepingState } from './gameStates/SweepingState';

export enum AIDifficulty {
    Easy,
    Hard
}

@Injectable()
export class GameController {
    private readonly HOST_NAME = "http://" + window.location.hostname;
    private readonly SERVER_PORT = ":3001";

    private gameEngine: GameEngine;
    private gameState: IGameState;
    private playerName = "";
    private gameData: IGameData = { isPlayerTurn: false };

    public init(container?: HTMLElement): void {
        this.gameEngine = GameEngine.getInstance();
        let self = this;
        this.gameEngine.init(container, this)
            .then(() => {
                self.initGameStates();
                self.gameState = IdleState.getInstance().enterState();
                self.gameEngine.update();
            })
            .catch(() => {
                throw new Error("Error: Could not initialize GameController!");
            });
    }

    public updateState(delta: number): void {
        this.gameState.update(delta);
    }

    public getPlayerName(): string {
        return this.playerName;
    }

    public setPlayerName(name: string): void {
        this.playerName = name;
    }

    public getGameData(): IGameData {
        return this.gameData;
    }

    public onResize(event: any): void {
        this.gameEngine.onResize(event);
    }

    public switchCamera(): void {
        this.gameEngine.switchCamera();
    }

    public quitGame(): void {
        // Send beacon to server to signal name removal before page unload.
        let blob = new Blob([JSON.stringify({ "name": this.playerName })], { type: 'application/json; charset=UTF-8' });
        navigator.sendBeacon(this.HOST_NAME + this.SERVER_PORT + "/removeName", blob);
    }

    private initGameStates(): void {
        ChoosingAngleState.getInstance().init(this);
        EndThrowState.getInstance().init(this);
        IdleState.getInstance().init(this);
        ShootingState.getInstance().init(this);
        SweepingState.getInstance().init(this);
    }
}

export interface IGameData {
    isPlayerTurn: boolean;
}