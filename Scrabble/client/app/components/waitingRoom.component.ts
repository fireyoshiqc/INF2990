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
import { PlayerHandler } from '../modules/playerHandler.module';
import { Player } from '../classes/player';

@Component({
    moduleId: module.id,
    selector: 'waiting-room-comp',
    templateUrl: '/assets/templates/waitingRoom.component.html',
    providers: [RoomService]
})

export class WaitingRoomComponent {
    private player: Player;
    private playerList: string[];
    private missingPlayers: number;
    private timer: any;

    constructor(public dialogRef: MdDialogRef<WaitingRoomComponent>,
        public router: Router, private roomService: RoomService) {
        this.roomService = roomService;
        this.player = PlayerHandler.requestPlayer();
        this.playerList = [];

        // Updates the room info every second
        this.timer = setInterval(() => {
            let roomInfo = this.roomService.getRoomInfo();
            this.playerList = roomInfo.playerList;
            this.missingPlayers = this.roomService.getMissingPlayers();
            this.startIfFull();
        }, 1000);
    }

    // Player has pressed quit or esc to quit the room
    @HostListener('window:keydown', ['$event'])
    public keyboardInput(event: KeyboardEvent): void {
        if (event.key === "Escape" && this.missingPlayers !== 0) {
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
                this.roomService.startGame(this.player.getRoomID());
            }, 3000);
        }
    }
}
