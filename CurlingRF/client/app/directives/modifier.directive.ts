import { Directive, Input } from '@angular/core';
import { GameEngine } from '../services/gameEngine.service';

@Directive({
    selector: 'modifier'
})
export class ModifierDirective {
    constructor(private gameEngine: GameEngine) {
    }

    @Input()
    public set container(value: HTMLElement) {
        if (value) {
            this.gameEngine.init(value);
        }
    }

}
