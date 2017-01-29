import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SudokuGridComponent } from './components/sudokuGrid.component';
import { ControlPanelComponent } from './components/controlPanel.component';

@NgModule({
  imports: [ BrowserModule, HttpModule ],
  declarations: [ AppComponent, SudokuGridComponent, ControlPanelComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
