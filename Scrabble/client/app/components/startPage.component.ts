import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerManagerService } from '../services/playerManager.service';

@Component({
    selector: 'startPage-comp',
    templateUrl: '/assets/templates/startPage.component.html',
    providers:[PlayerManagerService]
})
export class StartPageComponent {
    nbPlayers: number;
    playerName: string;

    constructor(public router: Router, private playerManagerService: PlayerManagerService) {
        this.playerManagerService = playerManagerService;
    }

    onJoin() {
        console.log(this.nbPlayers, this.playerName);

        this.router.navigate(['/waitingRoom']); 
    }

}