
import { Component, OnInit, HostListener } from '@angular/core';
import { GameController } from '../services/gameController.service';

@Component({
    selector: 'my-gl',
    template: `
        <modifier [container]="container"></modifier>
        <div #container (window:resize)="onResize($event)">
            <button md-raised-button id="cameraButton" (click)="switchCamera()">Changer la caméra</button>
        </div>
    `,
})
export class GlComponent implements OnInit {
    ngOnInit(): void {
        console.log("ngOnInit called");
    }

    constructor(private gameController: GameController) {
        // Empty constructor necessary for Angular
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

    switchCamera() : void {
        this.gameController.switchCamera();
    }
}
