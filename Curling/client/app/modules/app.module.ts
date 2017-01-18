import { NgModule  }      from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { FormsModule  }   from '@angular/forms';

import { AppRoutingModule } from './app-routing.module'

import { AppComponent } from '../components/app.component';
import { GlComponent } from '../components/gl.component';
import { DashboardComponent } from '../components/dashboard.component';


import { ModifierDirective } from '../directives/modifier.directive'

import { RenderService } from '../services/render.service';

import { MaterialModule } from '@angular/material'

@NgModule({
  imports: [ BrowserModule, FormsModule, AppRoutingModule, MaterialModule.forRoot()],
  declarations: [ AppComponent, GlComponent, DashboardComponent, ModifierDirective],
  providers: [ RenderService ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
