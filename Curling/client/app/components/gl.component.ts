
import { Component, OnInit, HostListener } from '@angular/core';
import { GameRenderer } from '../services/gameRenderer';

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

    constructor(private gameRenderer: GameRenderer) {
        // Empty constructor necessary for Angular
    }

    onResize(event: any) {
        this.gameRenderer.onResize(event);
    }

    // Player can switch camera view
    @HostListener('window:keydown', ['$event'])
    keyboardInput(event: KeyboardEvent) {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            this.switchCamera();
        }
    }

    switchCamera() : void {
        this.gameRenderer.switchCamera();
    }
}
