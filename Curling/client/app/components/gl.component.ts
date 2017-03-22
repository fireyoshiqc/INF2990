
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

    constructor(public dialog: MdDialog, private gameController: GameController) { }

    public ngAfterViewInit() {
        // Necessary to fix prodmode exclusive error (data binding changed on init)
        setTimeout(() => {
            this.dialogRef = this.dialog.open(NameDialogComponent, {
                disableClose: true
            });

            this.dialogRef.afterClosed().subscribe(result => {
                this.gameController.setPlayerName(result.playerName);

                if (result.difficulty === "facile") {
                    this.gameController.setAIDifficulty(AIDifficulty.Easy);
                    // TODO : this.gameController.startAIEasy();
                }
                else if (result.difficulty === "difficile") {
                    this.gameController.setAIDifficulty(AIDifficulty.Hard);
                    // TODO : this.gameController.startAIHard();
                }

                this.gameController.enterIdleState();
            });
        });
    }

    public getGameController(): GameController {
        return this.gameController;
    }

    public getTheme(): boolean {
        return this.isDarkTheme;
    }

    public toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
    }

    public onResize(event: any) {
        this.gameController.onResize(event);
    }

    @HostListener('window:keydown', ['$event'])
    public keyboardInput(event: KeyboardEvent) {
        // Player can switch camera view
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            this.switchCamera();
        }

        // Player can go to next throw or round
        this.gameController.onKeyboardDown(event);
    }

    @HostListener('window:mousedown', ['$event'])
    public onMouseDown(event: any) {
        this.gameController.onMousedown(event);
    }

    @HostListener('window:mouseup', ['$event'])
    public onMouseUp(event: any) {
        this.gameController.onMouseUp(event);
    }

    @HostListener('window:mousemove', ['$event'])
    public onMouseMove(event: any) {
        this.gameController.onMouseMove(event);
    }

    @HostListener('window:beforeunload', ['$event'])
    public onBeforeUnload(event: any): any {
        this.gameController.quitGame();
        return;
    }

    public resetGame(): void {
        // TODO
        alert("reset");
    }

    public switchCamera(): void {
        this.gameController.switchCamera();
    }

    public startThrowStone(event: any): void {
        this.gameController.startThrowStone(event);
    }
}

@Component({
    template: `<name-selector-comp></name-selector-comp>`
})

export class NameDialogComponent {
    constructor( @Optional() public dialogRef: MdDialogRef<any>) { }
}
