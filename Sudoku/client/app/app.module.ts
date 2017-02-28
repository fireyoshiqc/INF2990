import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { SudokuGridComponent } from './components/sudokuGrid.component';
import { GameAreaComponent, NameDialogComponent } from './components/gameArea.component';
import { NameSelectorComponent } from './components/nameSelector.component';

import 'hammerjs';

@NgModule({
    imports: [BrowserModule, HttpModule, MaterialModule.forRoot(), FlexLayoutModule.forRoot()],
    declarations: [AppComponent, SudokuGridComponent, GameAreaComponent, NameSelectorComponent, NameDialogComponent],
    entryComponents: [NameDialogComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
