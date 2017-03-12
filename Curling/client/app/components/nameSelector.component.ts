/**
 * nameSelector.component.ts
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/03/11
 */

import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { NameService } from '../services/name.service';

@Component({
    moduleId: module.id,
    selector: 'name-selector-comp',
    templateUrl: '/assets/templates/nameSelector.component.html',
    providers: [NameService]
})

export class NameSelectorComponent {
    private aiDifficulty: string;
    private playerName: string;
    private error = false;
    private errorMessage: string;

    constructor(public dialogRef: MdDialogRef<NameSelectorComponent>, private nameService: NameService) {
    }

    onStart() {
        this.error = false;

        if (this.aiDifficulty !== undefined && this.playerName !== undefined) {
            this.nameService.validateName(this.playerName).then((response) => {
                if (response) {
                    this.dialogRef.close({ difficulty: this.aiDifficulty, playerName: this.playerName });
                } else {
                    this.error = true;
                    this.errorMessage = "Ce nom est déjà pris ou contient des caractères invalides!";
                }
            });
        } else if (this.aiDifficulty === undefined) {
            this.error = true;
            this.errorMessage = "Veuillez choisir une difficulté pour l'ordinateur.";
        } else {
            this.error = true;
            this.errorMessage = "Veuillez entrer un nom valide.";
        }
    }
}
