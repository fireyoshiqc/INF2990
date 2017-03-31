/**
 * waitingRoom.component.ts
 *
 * @authors Yawen Hou, Erica Bugden, Mikael Ferland, Pierre To, Vincent Chassé, Félix Boulet
 * @date 2017/02/16
 */

import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '../services/room.service';
import { MdDialogRef } from '@angular/material';

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
    private timer: any;

    constructor(public dialogRef: MdDialogRef<WaitingRoomComponent>,
        public router: Router, private roomService: RoomService) {
        this.roomService = roomService;
        this.playerList = [];

        // Updates the room info every second
        this.timer = setInterval(() => {
            let roomInfo = this.roomService.getRoomInfo();
            this.playerName = this.roomService.getPlayerName();
            this.roomID = roomInfo.roomID;
            this.playerList = roomInfo.playerList;
            this.missingPlayers = this.roomService.getMissingPlayers();
            this.startIfFull();
        }, 1000);
    }

    // Player has pressed quit or esc to quit the room
    @HostListener('window:keydown', ['$event'])
    public keyboardInput(event: KeyboardEvent): void {
        if (event.key === "Escape") {
            this.leaveWaitingRoom();
        }
    }

    public leaveWaitingRoom(): void {
        clearInterval(this.timer);
        this.roomService.leaveRoom();
        this.dialogRef.close();
    }

    public startIfFull(): void {
        if (this.missingPlayers === 0) {
            clearInterval(this.timer);
            setTimeout(() => {
                this.dialogRef.close();
                this.router.navigate(['/game']);
            }, 2000);

            setTimeout(() => {
                this.roomService.startGame(this.roomID);
            }, 4000);
        }
    }
}
