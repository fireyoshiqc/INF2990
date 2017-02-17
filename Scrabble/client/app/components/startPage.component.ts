import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'startPage-comp',
    templateUrl: '/assets/templates/startPage.component.html'
})
export class StartPageComponent {
    nbPlayers: number;
    playerName: string;

    constructor(public router: Router) {

    }

    onJoin() {
        console.log(this.nbPlayers, this.playerName);

        this.router.navigate(['/waitingRoom']); 
    }

}