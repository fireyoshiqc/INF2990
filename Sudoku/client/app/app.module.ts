import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SudokuGridComponent } from './components/sudokuGrid.component';

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ AppComponent, SudokuGridComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
