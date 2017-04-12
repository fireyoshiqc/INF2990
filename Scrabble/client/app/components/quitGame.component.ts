/**
 * quitGame.component.ts
 *
 * @authors Pierre To
 * @date 2017/04/10
 */

import { Component, Optional } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
    moduleId: module.id,
    selector: 'quitgame-comp',
    templateUrl: '/assets/templates/quitGame.component.html',
})

export class QuitGameComponent {
    constructor(public dialogRef: MdDialogRef<QuitGameComponent>) { }
}

@Component({
    template: `<quitgame-comp></quitgame-comp>`
})

export class QuitGamePopupComponent {
    constructor( @Optional() public dialogRef: MdDialogRef<any>) { }
}

