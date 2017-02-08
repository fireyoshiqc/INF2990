
import { Component, OnInit, NgZone } from '@angular/core';
import { GameRenderer } from '../services/gameRenderer';

@Component({
    selector: 'my-gl',
    template: `
        <modifier [container]="container"></modifier>
        <div #container></div>
    `,
})
export class GlComponent implements OnInit {
    ngOnInit(): void { console.log("ngOnInit called"); }
    constructor(private gameRenderer: GameRenderer, private ngZone: NgZone) {
        window.onresize = (e) => {
            this.ngZone.run(() => {
                gameRenderer.onResize();
            });
        };
    }
}
