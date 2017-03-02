/**
 * nameSelector.component.ts
 *
 * @authors Félix Boulet, Erica Bugden
 * @date 2017/02/18
 */

import { Component } from '@angular/core';
//import { RoomService } from '../services/room.service';
import { MdDialogRef } from '@angular/material';

@Component({
    moduleId: module.id,
    selector: 'name-selector-comp',
    templateUrl: '/assets/templates/nameSelector.component.html',
})
export class NameSelectorComponent {
    difficulty: string;
    playerName: string;
    error: boolean = false;
    errorMessage : string;

    constructor(public dialogRef: MdDialogRef<NameSelectorComponent>) {
    }

    onStart() {
        this.error = false;
        //TODO: Make real validation for player name. This is temporary.
        if (this.difficulty !== undefined && this.playerName !== undefined && this.playerName.length >= 4) {
            this.dialogRef.close({ difficulty: this.difficulty, playerName: this.playerName });
        }
        else if (this.difficulty === undefined){
            this.error = true;
            this.errorMessage = "Veuillez choisir une difficulté.";
        }
        else {
            this.error = true;
            this.errorMessage = "Veuillez entrer un nom valide.";
        }
    }
}


