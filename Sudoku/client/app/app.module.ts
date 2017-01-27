import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SudokuGridComponent } from './components/sudokuGrid.component';
import { ButtonTestComponent } from './components/buttonTest.component';

@NgModule({
  imports: [ BrowserModule, HttpModule ],
  declarations: [ AppComponent, SudokuGridComponent, ButtonTestComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
