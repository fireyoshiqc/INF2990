/**
 * resetGame.component.ts
 *
 * @authors Pierre To
 * @date 2017/04/14
 */

import { Component, Optional } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
    moduleId: module.id,
    selector: 'resetgame-comp',
    templateUrl: '/assets/templates/resetGame.component.html',
})

export class ResetGameComponent {
    constructor(public dialogRef: MdDialogRef<ResetGameComponent>) { }
}

@Component({
    template: `<resetgame-comp></resetgame-comp>`
})

export class ResetGamePopupComponent {
    constructor( @Optional() public dialogRef: MdDialogRef<any>) { }
}

