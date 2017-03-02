
import { Component, HostListener } from '@angular/core';
import { GameController } from '../services/gameController.service';

@Component({
    selector: 'my-gl',
    templateUrl: "/assets/templates/gl.component.html",
    providers: [GameController]
})

export class GlComponent {
    private isDarkTheme = false;

    constructor(private gameController: GameController) {
        // Empty constructor necessary for Angular
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

    resetGame(): void {
        // TODO
        alert("reset");
    }

    switchCamera(): void {
        this.gameController.switchCamera();
    }

    startThrowStone(event?: any): void{
        this.gameController.startThrowStone();
    }
}
