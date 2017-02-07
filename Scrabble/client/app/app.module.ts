import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './components/app.component';
import { ChatComponent } from './components/chat.component';
import { BoardComponent } from './components/board.component';
import { RackComponent } from './components/rack.component';

@NgModule({
    imports: [BrowserModule, FormsModule],
    declarations: [AppComponent, ChatComponent, BoardComponent, RackComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
