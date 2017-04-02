import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { SudokuGridComponent } from './components/sudokuGrid.component';
import { GameAreaComponent } from './components/gameArea.component';
import { NameSelectorComponent, NameDialogComponent } from './components/nameSelector.component';
import { HighscoresComponent, HighscoresPopupComponent } from './components/highscores.component';

import 'hammerjs';

@NgModule({
    imports: [BrowserAnimationsModule, BrowserModule, FormsModule, HttpModule,
        MaterialModule.forRoot(), FlexLayoutModule.forRoot()],
    declarations: [AppComponent, SudokuGridComponent, GameAreaComponent, NameSelectorComponent, NameDialogComponent,
        HighscoresComponent, HighscoresPopupComponent],
    entryComponents: [NameDialogComponent, HighscoresPopupComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
