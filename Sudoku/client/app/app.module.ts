import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { SudokuGridComponent, NameDialogComponent } from './components/sudokuGrid.component';
import { GameAreaComponent } from './components/gameArea.component';
import { NameSelectorComponent } from './components/nameSelector.component';

import 'hammerjs';

@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, MaterialModule.forRoot(), FlexLayoutModule.forRoot()],
    declarations: [AppComponent, SudokuGridComponent, GameAreaComponent, NameSelectorComponent, NameDialogComponent],
    entryComponents: [NameDialogComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
