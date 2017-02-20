/**
 * waitingRoom.component.ts
 *
 * @authors Yawen Hou, Erica Bugden, Mikael Ferland, Pierre To
 * @date 2017/02/16
 */

import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '../services/room.service';

@Component({
    moduleId: module.id,
    selector: 'waiting-room-comp',
    templateUrl: '/assets/templates/waitingRoom.component.html',
    providers: [RoomService]
})
export class WaitingRoomComponent {
    private playerName: string;
    private roomID: number;
    private playerList: string[];
    private missingPlayers: number;
    private timer: NodeJS.Timer;

    constructor(public router: Router, private roomService: RoomService) {
        this.roomService = roomService;

        // Updates the room info every second
        this.timer = setInterval(() => {
            this.roomService.refreshRoomInfo();

            this.playerName = this.roomService.getPlayerName();
            this.roomID = this.roomService.getRoomInfo().roomID;
            this.playerList = this.roomService.getRoomInfo().playerList;
            this.missingPlayers = this.roomService.getRoomInfo().capacity
                                - this.roomService.getRoomInfo().playerList.length;
        }, 1000);
    }

    // Player has pressed quit or esc to quit the room
    @HostListener('window:keydown', ['$event'])
    keyboardInput(event: KeyboardEvent) {
        if (event.key === "Escape") {
            this.leaveWaitingRoom();
        }
    }

    leaveWaitingRoom() {
        clearInterval(this.timer);
        this.roomService.leaveRoom();
        this.router.navigate(['/startPage']);
    }
}
