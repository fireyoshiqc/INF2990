
import { Component, HostListener, AfterViewInit } from '@angular/core';
import { GameController } from '../services/gameController.service';
import { ResetGamePopupComponent } from './resetGame.component';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
    selector: 'my-gl',
    templateUrl: "/assets/templates/gl.component.html",
    providers: [GameController]
})

export class GlComponent implements AfterViewInit {
    private isDarkTheme = false;
    private resetDialogRef: MdDialogRef<ResetGamePopupComponent>;

    constructor(public dialog: MdDialog, private gameController: GameController) { }

    public ngAfterViewInit(): void {
        this.gameController.showNameDialog();
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
        } else { // For space bar
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

    public resetGame(): void {
        // User confirmation popup
        this.resetDialogRef = this.dialog.open(ResetGamePopupComponent);

        // User confirmation response
        this.resetDialogRef.afterClosed().subscribe(confirmQuit => {
            if (confirmQuit) {
                this.gameController.resetGame();
            }
        });
    }

    public showHighscores(): void {
        this.gameController.showHighscores();
    }
}
