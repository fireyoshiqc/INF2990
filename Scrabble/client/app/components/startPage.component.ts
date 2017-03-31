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
    private capacity: number;
    private playerName: string;
    private nameValid: boolean;
    private error: boolean;
    private errorMessage: string;

    constructor(public dialog: MdDialog, private playerManagerService: PlayerManagerService) {
        this.playerManagerService = playerManagerService;
        this.nameValid = false;
        this.error = false;
        this.errorMessage = "";
        this.playerName = "";
    }

    public confirmName(): void {
        if (this.playerName !== "") {
            this.nameValid = this.playerManagerService.isNameValid();

            if (this.nameValid) {
                this.error = false;
            } else {
                this.error = true;
                this.errorMessage = "Ce nom est déjà pris ou contient des caractères invalides!";
                this.nameValid = false;
            }
        } else {
            this.error = true;
            this.errorMessage = "Veuillez entrer un nom.";
        }
    }

    public confirmCapacity(indicationMessage: HTMLElement): void {
        if (this.capacity > 1) {
            this.playerManagerService.setName(this.playerName);
            this.playerManagerService.setCapacity(this.capacity);
            this.playerManagerService.addPlayer();

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

    public validateName(): void {
        this.playerManagerService.validateName(this.playerName);
    }
}

@Component({
    template: `<waiting-room-comp></waiting-room-comp>`
})

export class WaitingDialogComponent {
    constructor( @Optional() public dialogRef: MdDialogRef<any>) { }
}
