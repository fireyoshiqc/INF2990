/**
 * startPage.component.ts
 *
 * @authors Vincent Chassé, Yawen Hou
 * @date 2017/02/18
 */

import { Component, Optional } from '@angular/core';
import { PlayerManagerService } from '../services/playerManager.service';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
    selector: 'startpage-comp',
    templateUrl: '/assets/templates/startPage.component.html',
    providers: [PlayerManagerService]
})
export class StartPageComponent {

    capacity: number;
    playerName: string;

    constructor(public dialog: MdDialog, private playerManagerService: PlayerManagerService) {
        this.playerManagerService = playerManagerService;
    }

    onJoin() {
        if (this.playerManagerService.isNameValid()) {
            if (this.capacity > 1) {
                this.playerManagerService.setName(this.playerName);
                this.playerManagerService.setCapacity(this.capacity);
                this.playerManagerService.addPlayer();
                setTimeout(() => {
                    this.dialog.open(WaitingDialogComponent, {
                        disableClose: true
                    });
                }, 200);
            } else {
                alert("Veuillez choisir une taille de partie!!");
            }
        } else {
            alert("Nom invalide!!");
        }
    }

    validateName() {
        this.playerManagerService.validateName(this.playerName);
    }
}

@Component({
    template: `<waiting-room-comp></waiting-room-comp>`
})

export class WaitingDialogComponent {
    constructor( @Optional() public dialogRef: MdDialogRef<any>) { }
}
