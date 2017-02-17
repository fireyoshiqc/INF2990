import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerManagerService } from '../services/playerManager.service';

@Component({
    selector: 'startpage-comp',
    templateUrl: '/assets/templates/startPage.component.html',
    providers:[PlayerManagerService]
})
export class StartPageComponent {
    capacity: number;
    playerName: string;

    constructor(public router: Router, private playerManagerService: PlayerManagerService) {
        this.playerManagerService = playerManagerService;
    }

    onJoin() {
        console.log(this.capacity, this.playerName);
        this.playerManagerService.validateName(this.playerName);
        if (this.playerManagerService.isNameValid()) {


            console.log("name valide!!!");
            this.playerManagerService.setName(this.playerName);
            this.playerManagerService.addPlayer();

            this.playerManagerService.setCapacity(this.capacity);
            this.router.navigate(['/waitingRoom']);
        }
    }
}
