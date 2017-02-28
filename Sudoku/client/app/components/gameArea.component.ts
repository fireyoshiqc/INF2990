import { Component, Optional, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
    selector: 'game-area',
    templateUrl: '/assets/templates/gameArea.component.html'
})
export class GameAreaComponent implements OnInit {
    private isDarkTheme = false;
    capacity: number;
    playerName: string;

    constructor(public dialog: MdDialog) {
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
    }
    ngOnInit() {
        this.dialog.open(NameDialogComponent, {
            disableClose: true
        });
    }
}

@Component({
    template: `<name-selector-comp></name-selector-comp>`
})

export class NameDialogComponent {
    constructor( @Optional() public dialogRef: MdDialogRef<any>) { }
}
