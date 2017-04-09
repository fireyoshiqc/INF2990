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
import { PlayerIdleState } from './gameStates/PlayerIdleState';
import { ShootingState } from './gameStates/ShootingState';
import { SweepingState } from './gameStates/SweepingState';
import { EndGameState } from './gameStates/EndGameState';
import { AIPlayingState } from './gameStates/AIPlayingState';
import { StartGameState } from './gameStates/StartGameState';
import { HighscoresService } from '../services/highscores.service';
import { HighscoresPopupComponent, HighscoresComponent } from '../components/highscores.component';
import { MdDialog, MdDialogRef } from '@angular/material';

export enum AIDifficulty {
    Undefined,
    Normal,
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
        forceVisible: false,
        sliderDisabled: false,
        cameraDisabled: false,
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
    private aiDifficulty = AIDifficulty.Undefined;
    private scoreDialogRef: MdDialogRef<HighscoresPopupComponent>;

     constructor(public dialog: MdDialog, private highscoresService: HighscoresService) { }

    public init(container?: HTMLElement): void {
        this.gameEngine = GameEngine.getInstance();
        let self = this;
        this.gameEngine.init(container, this)
            .then(() => {
                self.initGameStates().then(() => {
                    self.gameData.state = StartGameState.getInstance().enterState();

                    self.gameEngine.update();
                })
                    .catch(() => {
                        throw new Error("Error: Could not initialize game states!");
                    });
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

    public getAIDifficulty(): AIDifficulty {
        return this.aiDifficulty;
    }

    public setAIDifficulty(aiDifficulty: string): void {
        this.aiDifficulty = (aiDifficulty === "Ordi normal") ? AIDifficulty.Normal : AIDifficulty.Hard;
    }

    public resetAIDifficulty(): void {
        this.aiDifficulty = AIDifficulty.Undefined;
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
        if (!this.getHUDData().cameraDisabled) {
            this.gameEngine.switchCamera();
        }
    }

    public startGame(): void {
        // See nextState() in StartGameState.ts
        this.gameData.state = this.gameData.state.nextState();
    }

    public startThrowStone(event: any): void {
        this.gameData.spinClockwise = (event === "true");
        this.gameData.state = this.gameData.state.nextState();
        this.hudData.sliderDisabled = true; // Prevent modification of spin once it has been selected
    }

    public startNextThrow(): void {
        this.hudData.nextThrowMessageVisible = false;
        this.gameData.state = PlayerIdleState.getInstance().nextState();
    }

    public quitGame(): void {
        // Send beacon to server to signal name removal before page unload.
        let blob = new Blob([JSON.stringify({ "name": this.playerName })], { type: 'application/json; charset=UTF-8' });
        navigator.sendBeacon(this.HOST_NAME + this.SERVER_PORT + "/api/removeName", blob);
    }

    private async initGameStates(): Promise<any> {
        let initPromise = new Promise((resolve, reject) => {
            ChoosingAngleState.getInstance().init(this);
            EndThrowState.getInstance().init(this);
            PlayerIdleState.getInstance().init(this);
            ShootingState.getInstance().init(this);
            SweepingState.getInstance().init(this);
            EndGameState.getInstance().init(this);
            AIPlayingState.getInstance().init(this);
            StartGameState.getInstance().init(this);
            resolve();
        });
        return initPromise;
    }

    public addHighscore(): Promise<boolean> {
        return this.highscoresService.addHighscore(this.playerName, this.gameData, this.aiDifficulty);
    }

     public showHighscores(): void {
        this.highscoresService.getHighscores()
            .then((scores) => {
                if (scores !== undefined) {

                    // Find new highscore for current player
                    let newScoreIndex: number;

                    if (this.aiDifficulty === AIDifficulty.Normal) {
                        newScoreIndex = this.getNewScoreIndex(scores.easy);
                    } else {
                        newScoreIndex = this.getNewScoreIndex(scores.hard);
                    }

                    // Pop the popup!
                    this.showHighscoresDialog(scores, newScoreIndex);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    private showHighscoresDialog(highscores: any, newScoreIndex: number): void {
        setTimeout(() => {
            this.scoreDialogRef = this.dialog.open(HighscoresPopupComponent);
            (this.scoreDialogRef.componentInstance.dialogRef.componentInstance as HighscoresComponent)
                .newScore = { difficulty: this.aiDifficulty, index: newScoreIndex };
            (this.scoreDialogRef.componentInstance.dialogRef.componentInstance as HighscoresComponent)
                .highscores = { easy: highscores.easy, hard: highscores.hard };
        });
    }

    private getNewScoreIndex(score: any): number {
        for (let index = 0; index < score.length; index++) {
            if (score[index].name === this.playerName &&
                score[index].playerScore === this.gameData.playerScore &&
                score[index].aiScore === this.gameData.aiScore) {
                return index;
            }
        }

        return -1;
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
    forceVisible: boolean;
    sliderDisabled: boolean;
    cameraDisabled: boolean;
    nextThrowMessageVisible: boolean;
    nextRoundMessageVisible: boolean;
}
