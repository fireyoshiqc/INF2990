
import { Component, OnInit, HostListener } from '@angular/core';
import { GameController } from '../services/gameController.service';

export enum AIDifficulty {
    Easy,
    Hard
}

@Component({
    selector: 'my-gl',
    templateUrl: "/assets/templates/gl.component.html",
    providers: [GameController]
})
export class GlComponent implements OnInit {
    private isDarkTheme = false;

    // TODO : Refactor
    private playerCurlingStones = [1, 2, 3, 4, 5, 6, 7];
    private aiCurlingStones = [1, 2, 3, 4, 5, 6, 7];
    private playerName = "Nom joueur";
    private aiDifficulty = "CPU facile";
    private playerScore = 0;
    private aiScore = 0;
    private rounds = [true, false, false];

    ngOnInit(): void {
        console.log("ngOnInit called");
    }

    constructor(private gameController: GameController) {
        // Empty constructor necessary for Angular
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
    }

    onResize(event: any) {
        this.gameController.onResize(event);
    }

    // Player can switch camera view
    @HostListener('window:keydown', ['$event'])
    keyboardInput(event: KeyboardEvent) {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            this.switchCamera();
        }
    }

    resetGame(): void {
        // TODO
        alert("reset");
    }

    switchCamera(): void {
        this.gameController.switchCamera();
    }

    // TODO : Refactor
    setPlayerName(name: string): void {
        this.playerName = name;
    }

    setAIDifficulty(difficulty: AIDifficulty): void {
        this.aiDifficulty = (difficulty === AIDifficulty.Easy) ? "CPU facile" : "CPU difficile";
    }

    setPlayerScore(newScore: number): void {
        this.playerScore = newScore;
    }

    setAIScore(newScore: number): void {
        this.aiScore = newScore;
    }

    startNextRound(): void {
        let roundInProgress = this.rounds.findIndex(nextRound => nextRound === false);

        if (roundInProgress !== -1) {
            this.rounds[roundInProgress] = true;
        }
    }

    removePlayerCurlingStone(): void {
        this.playerCurlingStones.pop();

        // TODO : remove
        this.setPlayerScore(this.playerScore + 1);
    }

    removeAICurlingStone(): void {
        this.aiCurlingStones.pop();

        // TODO : remove
        this.setAIScore(this.aiScore + 1);
    }
}
