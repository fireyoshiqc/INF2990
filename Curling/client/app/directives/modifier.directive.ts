import { Directive, Input } from '@angular/core';
import { GameRenderer } from '../services/gameRenderer';

@Directive({
    selector: 'modifier'
})
export class ModifierDirective {
    constructor(private gameRenderer: GameRenderer) {
    }

    @Input()
    public set container(value: HTMLElement) {
        if (value) {
            this.gameRenderer.init(value);
        }
    }

}
