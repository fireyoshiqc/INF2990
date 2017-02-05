import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SudokuGridComponent } from './components/sudokuGrid.component';
import { GameAreaComponent } from './components/gameArea.component';

@NgModule({
    imports: [BrowserModule, HttpModule],
    declarations: [AppComponent, SudokuGridComponent, GameAreaComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
