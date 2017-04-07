import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from '../components/app.component';
import { GlComponent, NameDialogComponent } from '../components/gl.component';
import { PlayerNameComponent } from '../components/player-name.component';
import { HUDComponent } from '../components/hud.component';
import { GameController } from '../services/gameController.service';
import { NameSelectorComponent } from '../components/nameSelector.component';
import { HighscoresComponent, HighscoresPopupComponent } from '../components/highscores.component';

import { ModifierDirective } from '../directives/modifier.directive';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import 'hammerjs';

@NgModule({
    imports: [BrowserAnimationsModule, BrowserModule, FormsModule, AppRoutingModule,
        MaterialModule, FlexLayoutModule],
    declarations: [AppComponent, HUDComponent, GlComponent, ModifierDirective,
        PlayerNameComponent, NameSelectorComponent, NameDialogComponent, HighscoresComponent, HighscoresPopupComponent],
    entryComponents: [NameDialogComponent, HighscoresPopupComponent],
    providers: [GameController],
    bootstrap: [AppComponent]
})

export class AppModule { }
