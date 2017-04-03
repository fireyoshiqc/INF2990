/**
 * highscores.component.ts
 *
 * @authors Yawen Hou et Pierre To
 * @date 2017/04/03
 */

import { Component, Optional } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
    moduleId: module.id,
    selector: 'highscores-comp',
    templateUrl: '/assets/templates/highscores.component.html',
})

export class HighscoresComponent {
    public highscores: IHighscores = { easy: [], hard: [] };
    constructor(public dialogRef: MdDialogRef<HighscoresComponent>) { }
}

@Component({
    template: `<highscores-comp></highscores-comp>`
})

export class HighscoresPopupComponent {
    constructor( @Optional() public dialogRef: MdDialogRef<any>) { }
}

interface IHighscores {
    easy: Array<string>;
    hard: Array<string>;
}

