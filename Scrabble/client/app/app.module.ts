import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './components/app.component';
import { ChatComponent } from './components/chat.component';
import { BoardComponent } from './components/board.component';
import { RackComponent } from './components/rack.component';
import { InfoComponent } from './components/info.component';

@NgModule({
    imports: [BrowserModule, FormsModule, MaterialModule.forRoot(), FlexLayoutModule.forRoot()],
    declarations: [AppComponent, ChatComponent, BoardComponent, RackComponent, InfoComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
