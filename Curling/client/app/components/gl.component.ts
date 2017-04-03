
import { Component, HostListener, Optional, AfterViewInit } from '@angular/core';
import { GameController } from '../services/gameController.service';
import { HighscoresService } from '../services/highscores.service';
import { HighscoresPopupComponent, HighscoresComponent } from './highscores.component';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
    selector: 'my-gl',
    templateUrl: "/assets/templates/gl.component.html",
    providers: [GameController, HighscoresService]
})

export class GlComponent implements AfterViewInit {
    private isDarkTheme = false;
    private dialogRef: MdDialogRef<NameDialogComponent>;
    private scoreDialogRef: MdDialogRef<HighscoresPopupComponent>;

    constructor(public dialog: MdDialog, private gameController: GameController,
        private highscoresService: HighscoresService) { }

    public ngAfterViewInit(): void {
        // Necessary to fix prodmode exclusive error (data binding changed on init)
        setTimeout(() => {
            this.dialogRef = this.dialog.open(NameDialogComponent, {
                disableClose: true
            });

            this.dialogRef.afterClosed().subscribe(result => {
                this.gameController.setPlayerName(result.playerName);
            });
        });
    }

    public getTheme(): boolean {
        return this.isDarkTheme;
    }

    public toggleTheme(): void {
        this.isDarkTheme = !this.isDarkTheme;
    }

    public onResize(event: any): void {
        this.gameController.onResize(event);
    }

    public getGameController(): GameController {
        return this.gameController;
    }

    public startThrowStone(event: any): void {
        this.gameController.startThrowStone(event);
    }

    @HostListener('window:keydown', ['$event'])
    public keyboardInput(event: KeyboardEvent): void {
        // Player can switch camera view
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            this.switchCamera();
        } else if (event.key === " ") { // Space bar
            this.gameController.onKeyboardDown(event);
        }
    }

    @HostListener('window:mousedown', ['$event'])
    public onMouseDown(event: any): void {
        this.gameController.onMouseDown(event);
    }

    @HostListener('window:mouseup', ['$event'])
    public onMouseUp(event: any): void {
        this.gameController.onMouseUp(event);
    }

    @HostListener('window:mousemove', ['$event'])
    public onMouseMove(event: any): void {
        this.gameController.onMouseMove(event);
    }

    @HostListener('window:beforeunload', ['$event'])
    public onBeforeUnload(event: any): any {
        this.gameController.quitGame();
        return;
    }

    public switchCamera(): void {
        this.gameController.switchCamera();
    }

    public showHighscores(): void {
        this.highscoresService.getHighscores()
            .then((scores) => {
                if (scores !== undefined) {
                    // Pop the popup!
                    this.showHighscoresDialog(scores);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    public showHighscoresDialog(highscores: any): void {
        setTimeout(() => {
            this.scoreDialogRef = this.dialog.open(HighscoresPopupComponent);
            (this.scoreDialogRef.componentInstance.dialogRef.componentInstance as HighscoresComponent)
                .highscores = { easy: highscores.easy, hard: highscores.hard };
        });
    }
}

@Component({
    template: `<name-selector-comp></name-selector-comp>`
})

export class NameDialogComponent {
    constructor( @Optional() public dialogRef: MdDialogRef<any>) { }
}
