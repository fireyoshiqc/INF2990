import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'my-dashboard',
    template: `
    <nav>
        <a>
        WebGL (Il me manque des attributs de routage ! [dans le anchor])
        </a>
        <h2>Essayez d'entrer /glcomp comme route dans la barre d'URL</h2>
    </nav>
  `
})
export class DashboardComponent implements OnInit {
    private canPlay: boolean;
    constructor() { //ANGRY EMPTY BLOCK!
    }
    ngOnInit(): void {
        this.canPlay = true;
    }
}
