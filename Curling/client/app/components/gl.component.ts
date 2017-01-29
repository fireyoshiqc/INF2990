
import {Component,OnInit} from '@angular/core';
import { RenderService } from '../services/render.service';
import { GameRenderer } from '../gameRenderer';
import {MdDialog, MdDialogRef, MdSnackBar} from '@angular/material';
@Component({
    selector: 'My-GL',
    template:`
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
