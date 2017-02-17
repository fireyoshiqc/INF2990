import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
//import * as io from 'socket.io';

@Component({
    moduleId: module.id,
    selector: 'waiting-room-comp',
    templateUrl: '/assets/templates/waitingRoom.component.html'
})
export class WaitingRoomComponent {

    // TODO: get the right capacity once the start page is created
    capacity : number;
    nbPlayer : number;
    players : any;
    //socket : any;
    //  invalidField: Player[] = new Array<Player>();

    constructor(public router: Router) {
    }


    // Display the number of connected players once per second
    update() { //empty for the moment
    }

    // Player has pressed quit or esc to quit the room
    @HostListener('window:keydown', ['$event'])
    keyboardInput(event: KeyboardEvent) {
        if (event.key === "Escape") {
            this.router.navigate(['/testGame']); // TODO: Mettre le bon chemin
        }
    }
}
