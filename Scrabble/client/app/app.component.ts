import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
        <h1>Scrabble</h1>
        <board-comp></board-comp>
        <chat-comp></chat-comp>
  `,
})
export class AppComponent { name = 'Angular'; }
