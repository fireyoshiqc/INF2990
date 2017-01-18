import {Directive, Input} from '@angular/core';
import {RenderService} from '../services/render.service';

@Directive({
    selector: 'modifier'
})
export class ModifierDirective {
    public scale: number = 1;
    constructor(private _renderService: RenderService) {
    }

    @Input()
    public set container(value: HTMLElement) {
        if (value)
            this._renderService.init(value);
    }

    @Input()
    public set webgltext(value: string){
        if (!value) value = '';
        this._renderService.setText(value);
    }
    public addStars(stars: number) {
        //this._renderService.addStars(stars);
    }

    public updateScale(newScale: number) {
        //this._renderService.updateScale(newScale);
    }

    public printService(): void {
        this._renderService.print();
        if (true) {
            function s() {
                let x = '';
                return / <NBSP>regexp/;
            }
        }
    }

}
