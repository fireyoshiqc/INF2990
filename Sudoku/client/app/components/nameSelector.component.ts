/**
 * nameSelector.component.ts
 *
 * @authors Félix Boulet, Erica Bugden
 * @date 2017/02/18
 */

import { Component, Optional } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { NameService } from '../services/name.service';

@Component({
    moduleId: module.id,
    selector: 'name-selector-comp',
    templateUrl: '/assets/templates/nameSelector.component.html',
    providers: [NameService]
})
export class NameSelectorComponent {
    private difficulty: string;
    private playerName: string;
    private error = false;
    private errorMessage: string;

    constructor(public dialogRef: MdDialogRef<NameSelectorComponent>, private nameService: NameService) {
    }

    public onStart(): void {

        this.error = false;

        if (this.difficulty !== undefined && this.playerName !== undefined) {
            this.nameService.validateName(this.playerName).then((response) => {
                if (response) {
                    this.dialogRef.close({ difficulty: this.difficulty, playerName: this.playerName });
                }
                else {
                    this.error = true;
                    this.errorMessage = "Ce nom est déjà pris ou contient des caractères invalides!";
                }
            });
        }

        else if (this.difficulty === undefined) {
            this.error = true;
            this.errorMessage = "Veuillez choisir une difficulté.";
        }
        else {
            this.error = true;
            this.errorMessage = "Veuillez entrer un nom valide.";
        }
    }
}

@Component({
    template: `<name-selector-comp></name-selector-comp>`
})

export class NameDialogComponent {
    constructor( @Optional() public dialogRef: MdDialogRef<any>) { }
}
