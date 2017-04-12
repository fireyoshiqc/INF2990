/**
 * startPage.component.ts
 *
 * @authors Vincent Chassé, Yawen Hou
 * @date 2017/02/18
 */

import { Component, Optional } from '@angular/core';
import { PlayerManagerService } from '../services/playerManager.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { PlayerHandler } from '../modules/playerHandler.module';
import { Player } from '../classes/player';

@Component({
    selector: 'startpage-comp',
    templateUrl: '/assets/templates/startPage.component.html',
    providers: [PlayerManagerService]
})

export class StartPageComponent {
    private player: Player;
    private error: boolean;
    private errorMessage: string;

    constructor(public dialog: MdDialog, private playerManagerService: PlayerManagerService) {
        this.playerManagerService = playerManagerService;
        this.player = PlayerHandler.requestPlayer();
        this.error = false;
        this.errorMessage = "";

        // Value pageRefresh is set to "true" when user is refreshing the /game page
        // Value pageRefresh must be "false" to prevent multiple redirection to /startPage
        localStorage.setItem("pageRefresh", "false");
    }

    public confirmName(): void {
        if (this.player.getName() !== "") {
            this.player.setNameValid(this.playerManagerService.getNameValid());

            if (this.player.getNameValid()) {
                this.error = false;
                this.playerManagerService.addPlayer();
            } else {
                this.error = true;
                this.errorMessage = "Ce nom est déjà pris ou contient des caractères invalides!";
            }
        } else {
            this.error = true;
            this.errorMessage = "Veuillez entrer un nom.";
        }
    }

    public confirmCapacity(indicationMessage: HTMLElement): void {
        if (this.player.getRoomCapacity() > 1) {
            this.playerManagerService.joinRoom();

            this.dialog.open(WaitingDialogComponent, {
                disableClose: true
            });
        } else {
            indicationMessage.classList.add("invalid");

            setTimeout(() => {
                indicationMessage.classList.remove("invalid");
            }, 2000);
        }
    }

    public validateName(event: KeyboardEvent): void {
        this.playerManagerService.validateName(this.player.getName());

        if (event.key === "Enter") {
            this.confirmName();
        }
    }
}

@Component({
    template: `<waiting-room-comp></waiting-room-comp>`
})

export class WaitingDialogComponent {
    constructor( @Optional() public dialogRef: MdDialogRef<any>) { }
}
