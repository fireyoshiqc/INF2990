import {Directive, Input} from '@angular/core';
import {RenderService} from '../services/render.service';
import { GameRenderer } from '../gameRenderer'

@Directive({
    selector: 'modifier'
})
export class ModifierDirective {
    public scale: number = 1;
    // constructor(private _renderService: RenderService) {
    // }
    constructor(private gameRenderer: GameRenderer){
    }

    @Input()
    public set container(value: HTMLElement) {
        if (value)
            //this._renderService.init(value);
            this.gameRenderer.init(value);
    }

    @Input()
    public set webgltext(value: string){
        //if (!value) value = '';
        //this._renderService.setText(value);
    }
    

}
