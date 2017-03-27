import { Directive, Input } from '@angular/core';
import { GameController } from '../services/gameController.service';

@Directive({
    selector: 'modifier'
})
export class ModifierDirective {
    constructor(private gameController: GameController) {
    }

    @Input()
    public set container(value: HTMLElement) {
        if (value) {
            this.gameController.init(value);
        }
    }

}
