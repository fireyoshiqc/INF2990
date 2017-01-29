import { Component, OnInit } from '@angular/core';
import { GameRenderer } from '../gameRenderer';
@Component({
    selector: 'My-GL',
    template: `
        <modifier [container]="container"
                  [webgltext]="webgltext"></modifier>
        <div #container></div>
    `,
})
export class GlComponent implements OnInit {
    ngOnInit(): void {}
    constructor(private gameRenderer: GameRenderer) {
    }
}
