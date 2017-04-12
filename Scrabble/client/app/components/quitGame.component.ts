/**
 * quitGame.component.ts
 *
 * @authors Pierre To
 * @date 2017/04/10
 */

import { HostListener, Component, Optional } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
    moduleId: module.id,
    selector: 'quitgame-comp',
    templateUrl: '/assets/templates/quitGame.component.html',
})

export class QuitGameComponent {
    constructor(public dialogRef: MdDialogRef<QuitGameComponent>) { }

    // Player has pressed esc to cancel quitting the game
    @HostListener('window:keyup', ['$event'])
    public keyboardInput(event: KeyboardEvent): void {
        if (event.key === "Escape") {
            if (this.dialogRef) {
                this.dialogRef.close();
            }
        }
    }
}

@Component({
    template: `<quitgame-comp></quitgame-comp>`
})

export class QuitGamePopupComponent {
    constructor( @Optional() public dialogRef: MdDialogRef<any>) { }
}

