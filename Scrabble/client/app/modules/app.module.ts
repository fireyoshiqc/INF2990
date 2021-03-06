import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { StartPageComponent, WaitingDialogComponent } from '../components/startPage.component';
import { QuitGameComponent, QuitGamePopupComponent } from '../components/quitGame.component';

import 'hammerjs';

@NgModule({
    imports: [BrowserAnimationsModule, BrowserModule, FormsModule, AppRoutingModule,
        MaterialModule, FlexLayoutModule],
    declarations: [AppComponent, GameComponent, ChatComponent, BoardComponent, RackComponent, InfoComponent,
        WaitingRoomComponent, StartPageComponent, WaitingDialogComponent, QuitGameComponent, QuitGamePopupComponent],
    entryComponents: [WaitingDialogComponent, QuitGamePopupComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
