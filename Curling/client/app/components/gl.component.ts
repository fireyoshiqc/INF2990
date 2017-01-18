import {Component,OnInit} from '@angular/core';
import { RenderService } from '../services/render.service'
import {MdDialog, MdDialogRef, MdSnackBar} from '@angular/material';
@Component({
    selector: 'My-GL',
    template:`
        <dashboard></dashboard>
        <div>
            <md-card>
                <label for="displaceX">Displacement X</label>
                <md-input type="number" step="10" [(ngModel)]="xmodel" name="displaceX"></md-input>
                <button md-button color="primary" type="button" (click)="displaceX()">Enter</button>
            </md-card>
            
            <md-card>
                <label for="displaceY">Displacement Y</label>
                <md-input ink="All" type="number" step="10" [(ngModel)]="ymodel" name="displaceY"></md-input>
                <button type="button" md-button color="primary" (click)="displaceY()">Enter</button>
            </md-card>

            <md-card>
                Scale
                <md-slider step="2" min="0" max="200" tick-interval="10" thumb-label>
                </md-slider>
                <button md-button color="secondary" (click)="showNotImplemented()">Apply</button>
            </md-card>

            <md-card>
                <label for="texttoshow">Texte à écrire sur le canevas</label>
                <md-input type="text" [(ngModel)]="webgltext" name="texttoshow"
                    placeholder="Les chemises de l'archiduchesse sont-elles sèches ou archi-sèches ?">
                </md-input>
            </md-card>

            <md-card>
                <label for="displaceCameraZ">Camera Z</label>
                <md-input ink="All" type="number" step="10" [(ngModel)]="zCamera" name="displaceCameraZ"></md-input>
                <button md-button color="primary" type="button" (click)="displaceCameraZ()">Déplacer Caméra</button>
            </md-card>
            
            <md-card>
                <button md-button color="primary" (click)="newTeapot()"
                        md-tooltip="I dare you to click me">
                Teapot Madness
                </button>
            </md-card>
        </div>
        <modifier [container]="container"
                  [webgltext]="webgltext"></modifier>
        <div #container></div> 
    `,
})
export class GlComponent implements OnInit{
    webgltext: string;
    xmodel: number;
    ymodel: number;
    zCamera:number;
    ngOnInit():void{
        this.webgltext = "";
        this.xmodel = this.ymodel = 0;
        this.zCamera = 0;
        console.log(this.trigger());
    }
    constructor(private renderService : RenderService,
                private snackbar: MdSnackBar
                ){
        
    }

    private displaceX():void{
        this.renderService.translateMesh(this.xmodel,0);
    }
    
    private displaceY():void{
        this.renderService.translateMesh(0,this.ymodel);        
    }

    private displaceCameraZ():void{ 
        console.log(this.zCamera);
        this.renderService.translateCamera(0,0,this.zCamera);
    }

    private newTeapot(): void{
        for(let i = 0;i<1;++i)
            this.renderService.newTeapot();
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
        if(Math.random())
            console.log('cyclomatic')
    }
    
    private trigger(): string{
        var x;
        if (Math.random())
            x = function*(){ var a = yield Math.random(); }
        if (x)
        {
            var _new = x();
            var r = _new.next();
            console.log(r)
        }
        else
        {
            x = function(){return 'À traduire';}
            console.log(x() + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam varius augue eget magna commodo, a ultrices justo pretium. Proin id egestas eros. Sed pellentesque turpis et augue volutpat, ut aliquet nisi dignissim. Integer lobortis ligula ac leo imperdiet, eu viverra.');
        }
        for (var i = 0; i <42; ++i){
            try {
                var y = 1/Math.random();
            } catch(e) {
                console.log(e);
                return 'Catched';
            } finally {
                continue;
            }
        }
        return 'Will I be returned?';
   } 

   public showNotImplemented(): void{
       this.snackbar.open('Sorry, this is not implemented yet. Would you do it for me? :)', 'Yes')
   }
}