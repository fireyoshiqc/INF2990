
import { Component, HostListener, Optional, AfterViewInit } from '@angular/core';
import { GameController } from '../services/gameController.service';
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

    @HostListener('window:keydown', ['$event'])
    public keyboardInput(event: KeyboardEvent): void {
        // Player can switch camera view
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            this.gameController.switchCamera();
        }
    }

    @HostListener('window:beforeunload', ['$event'])
    public onBeforeUnload(event: any): any {
        this.gameController.quitGame();
        return;
    }
}

@Component({
    template: `<name-selector-comp></name-selector-comp>`
})

export class NameDialogComponent {
    constructor( @Optional() public dialogRef: MdDialogRef<any>) { }
}
