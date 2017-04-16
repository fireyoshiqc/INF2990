import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'my-app',
    template: '<main><router-outlet></router-outlet></main>'
})
export class AppComponent {
    private readonly PAGE_TITLE = "FACTORY/24 - Scrabble";

    public constructor(private titleService: Title) {
        this.titleService.setTitle(this.PAGE_TITLE);
    }
}
