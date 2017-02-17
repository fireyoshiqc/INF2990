import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from '../components/app.component';
import { GameComponent } from '../components/game.component';
import { ChatComponent } from '../components/chat.component';
import { BoardComponent } from '../components/board.component';
import { RackComponent } from '../components/rack.component';
import { InfoComponent } from '../components/info.component';
import { WaitingRoomComponent } from '../components/waitingRoom.component';
import { StartPageComponent } from '../components/startPage.component';

@NgModule({
    imports: [BrowserModule, FormsModule, AppRoutingModule, MaterialModule.forRoot(), FlexLayoutModule.forRoot()],
    declarations: [AppComponent, GameComponent, ChatComponent, BoardComponent, RackComponent, InfoComponent,
      WaitingRoomComponent, StartPageComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
