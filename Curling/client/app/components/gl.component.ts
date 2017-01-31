
import { Component, OnInit } from '@angular/core';
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
    constructor(private gameRenderer: GameRenderer) {
    }
}
