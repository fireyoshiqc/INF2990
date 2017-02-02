import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
        <h1>Chat area for Scrabble</h1>
        <chat-comp></chat-comp>
  `,
})
export class AppComponent { name = 'Angular'; }
