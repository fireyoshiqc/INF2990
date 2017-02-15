import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    template: '<main><router-outlet></router-outlet></main>'
})
export class AppComponent { name = 'Angular'; }
