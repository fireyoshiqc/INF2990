import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ChatComponent } from './chat.component';
import { BoardComponent } from "./board.component";

@NgModule({
  imports: [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, ChatComponent, BoardComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
