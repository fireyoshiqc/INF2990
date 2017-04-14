/**
 * nameSelector.component.ts
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/03/11
 */

import { Component, HostListener } from '@angular/core';
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
    private nameSelectionDisabled: boolean;

    constructor(public dialogRef: MdDialogRef<NameSelectorComponent>, private nameService: NameService) {
    }

    public setNameSelectionDisabled(disabled: boolean): void {
        this.nameSelectionDisabled = disabled;
    }

    public setName(name: string): void {
        this.playerName = name;
    }

    public validate(): void {
        this.error = false;
        if (this.nameSelectionDisabled) {
            this.dialogRef.close({ aiDifficulty: this.aiDifficulty, playerName: this.playerName });
            return;
        }
        if (this.aiDifficulty !== undefined && this.playerName !== undefined) {
            this.nameService.validateName(this.playerName).then((response) => {
                if (response) {
                    this.dialogRef.close({ aiDifficulty: this.aiDifficulty, playerName: this.playerName });
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

    @HostListener('window:keydown', ['$event'])
    public confirm(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            this.validate();
        }
    }
}

