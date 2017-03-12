
import { Component, HostListener, Optional, AfterViewInit } from '@angular/core';
import { GameController, AIDifficulty } from '../services/gameController.service';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
    selector: 'my-gl',
    templateUrl: "/assets/templates/gl.component.html",
    providers: [GameController]
})

export class GlComponent implements AfterViewInit {
    private isDarkTheme = false;
    private dialogRef: MdDialogRef<NameDialogComponent>;

    constructor(public dialog: MdDialog, private gameController: GameController) {
        // Empty constructor necessary for Angular
    }

    ngAfterViewInit() {
        // Necessary to fix prodmode exclusive error (data binding changed on init)
        setTimeout(() => {
            this.dialogRef = this.dialog.open(NameDialogComponent, {
                disableClose: true
            });

            this.dialogRef.afterClosed().subscribe(result => {
                this.gameController.setPlayerName(result.playerName);

                if (result.difficulty === "facile") {
                    this.gameController.setAIDifficulty(AIDifficulty.Easy);
                    //this.gameController.startAIEasy();
                }
                else if (result.difficulty === "difficile") {
                    this.gameController.setAIDifficulty(AIDifficulty.Hard);
                    //this.gameController.startAIHard();
                }
            });
        });
    }

    getGameController(): GameController {
        return this.gameController;
    }

    getTheme(): boolean {
        return this.isDarkTheme;
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

    @HostListener('window:mousedown', ['$event'])
    onMouseDown(event: any) {
        this.gameController.onMousedown(event);
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(event: any) {
        this.gameController.onMouseUp(event);
    }

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(event: any) {
        this.gameController.onMouseMove(event);
    }

    @HostListener('window:beforeunload', ['$event'])
    onBeforeUnload(event: any): any {
        this.gameController.quitGame();
        return;
    }

    resetGame(): void {
        // TODO
        alert("reset");
    }

    switchCamera(): void {
        this.gameController.switchCamera();
    }

    nextRound(): void {
        this.gameController.updateScore();
    }

    startThrowStone(event: any): void {
        this.gameController.startThrowStone(event);
    }
}

@Component({
    template: `<name-selector-comp></name-selector-comp>`
})

export class NameDialogComponent {
    constructor( @Optional() public dialogRef: MdDialogRef<any>) { }
}
