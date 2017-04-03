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

    private readonly MAX_THROWS = 16;

    private hudData: IHUDData = {
        playerStones: new Array<number>(this.MAX_THROWS / 2),
        aiStones: new Array<number>(this.MAX_THROWS / 2),
        aiDifficulty: "CPU facile",
        forceVisible: false,
        sliderDisabled: false,
        nextThrowMessageVisible: false,
        nextRoundMessageVisible: false
    };

    private gameData: IGameData = {
        state: null,
        playerScore: 0,
        aiScore: 0,
        isPlayerTurn: false,
        spinClockwise: false,
        curveAngle: 0,
        forceValue: 0,
        roundsCompleted: [false, false, false]
    };

    private gameEngine: GameEngine;
    private playerName = "";

    public init(container?: HTMLElement): void {
        this.gameEngine = GameEngine.getInstance();
        let self = this;
        this.gameEngine.init(container, this)
            .then(() => {
                self.initGameStates();
                // Choose first player randomly
                if (Math.random() > 0.5) {
                    self.gameData.isPlayerTurn = true;
                }
                self.gameData.state = IdleState.getInstance().enterState();
                self.gameEngine.update();
            })
            .catch(() => {
                throw new Error("Error: Could not initialize GameController!");
            });
    }

    public updateState(delta: number): void {
        if (this.gameData.state) {
            this.gameData.state.update(delta);
        }
    }

    public onMouseDown(event: any): void {
        if (this.gameData.state) {
            this.gameData.state.onMouseDown(event);
        }
    }

    public onMouseUp(event: any): void {
        if (this.gameData.state) {
            this.gameData.state.onMouseUp(event);
        }
    }

    public onMouseMove(event: any): void {
        if (this.gameData.state) {
            this.gameData.state.onMouseMove(event);
        }
    }

    public onKeyboardDown(event: KeyboardEvent): void {
        if (this.gameData.state) {
            this.gameData.state.onKeyboardDown(event);
        }
    }

    public getMaxThrows(): number {
        return this.MAX_THROWS;
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

    public getHUDData(): IHUDData {
        return this.hudData;
    }

    public onResize(event: any): void {
        this.gameEngine.onResize(event);
    }

    public switchCamera(): void {
        this.gameEngine.switchCamera();
    }

    public startThrowStone(event: any): void {
        this.gameData.spinClockwise = (event === "true");
        this.gameData.state = this.gameData.state.nextState();
        this.hudData.sliderDisabled = true; // Prevent modification of spin once it has been selected
    }

    public startNextThrow(): void {
        this.hudData.nextThrowMessageVisible = false;
        this.gameData.state = IdleState.getInstance().nextState();
    }

    public quitGame(): void {
        // Send beacon to server to signal name removal before page unload.
        let blob = new Blob([JSON.stringify({ "name": this.playerName })], { type: 'application/json; charset=UTF-8' });
        navigator.sendBeacon(this.HOST_NAME + this.SERVER_PORT + "/api/removeName", blob);
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
    state: IGameState;
    playerScore: number;
    aiScore: number;
    isPlayerTurn: boolean;
    spinClockwise: boolean;
    curveAngle: number;
    forceValue: number;
    roundsCompleted: boolean[];
}

export interface IHUDData {
    playerStones: Array<number>;
    aiStones: Array<number>;
    aiDifficulty: string;
    forceVisible: boolean;
    sliderDisabled: boolean;
    nextThrowMessageVisible: boolean;
    nextRoundMessageVisible: boolean;
}
