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
export class GlComponent implements OnInit{
    // webgltext: string;
    // xmodel: number;
    // ymodel: number;
    // zCamera:number;
    ngOnInit():void{
        // this.webgltext = "";
        // this.xmodel = this.ymodel = 0;
        // this.zCamera = 0;
        // console.log(this.trigger());
    }
    // constructor(private renderService : RenderService,
    //             private snackbar: MdSnackBar
    //             ){
    //
    // }
    constructor(private gameRenderer: GameRenderer){
    }

  //   private displaceX():void{
  //       this.renderService.translateMesh(this.xmodel,0);
  //   }
   //
  //   private displaceY():void{
  //       this.renderService.translateMesh(0,this.ymodel);
  //   }
   //
  //   private displaceCameraZ():void{
  //       console.log(this.zCamera);
  //       this.renderService.translateCamera(0,0,this.zCamera);
  //   }
   //
  //   private newTeapot(): void{
  //       for(let i = 0;i<1;++i)
  //           this.renderService.newTeapot();
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //       if(Math.random())
  //           console.log('cyclomatic')
  //   }
   //
  //   private trigger(): string{
  //       var x;
  //       if (Math.random())
  //           x = function*(){ var a = yield Math.random(); }
  //       if (x)
  //       {
  //           var _new = x();
  //           var r = _new.next();
  //           console.log(r)
  //       }
  //       else
  //       {
  //           x = function(){return 'À traduire';}
  //           console.log(x() + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam varius augue eget magna commodo, a ultrices justo pretium. Proin id egestas eros. Sed pellentesque turpis et augue volutpat, ut aliquet nisi dignissim. Integer lobortis ligula ac leo imperdiet, eu viverra.');
  //       }
  //       for (var i = 0; i <42; ++i){
  //           try {
  //               var y = 1/Math.random();
  //           } catch(e) {
  //               console.log(e);
  //               return 'Catched';
  //           } finally {
  //               continue;
  //           }
  //       }
  //       return 'Will I be returned?';
  //  }
   //
  //  public showNotImplemented(): void{
  //      this.snackbar.open('Sorry, this is not implemented yet. Would you do it for me? :)', 'Yes')
  //  }
}
