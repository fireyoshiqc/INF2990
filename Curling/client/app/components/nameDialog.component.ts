import { Component, Optional, ViewChild } from '@angular/core';
import { NameSelectorComponent } from './nameSelector.component';
import { MdDialogRef } from '@angular/material';

@Component({
    template: `<name-selector-comp></name-selector-comp>`
})

export class NameDialogComponent {

    @ViewChild(NameSelectorComponent) private nameSelector: NameSelectorComponent;
    constructor( @Optional() public dialogRef: MdDialogRef<any>) { }

    public setNameSelectionDisabled(disabled: boolean): void {
        this.nameSelector.setNameSelectionDisabled(disabled);
    }

    public setPlayerName(playerName: string): void {
        this.nameSelector.setName(playerName);
    }
}
