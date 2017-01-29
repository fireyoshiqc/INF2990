import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <h1>Sudoku</h1>
    <control-panel></control-panel>
    <sudoku-grid></sudoku-grid>
  `
})
export class AppComponent { }
