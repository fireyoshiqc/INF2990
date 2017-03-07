/**
 * rack.component.ts
 *
 * @authors Félix Boulet, Pierre To
 * @date 2017/02/06
 */

import { Component, OnInit } from '@angular/core';
import { RackManager } from '../services/rackManager.service';

import { Letter } from '../classes/letter';

@Component({
    moduleId: module.id,
    selector: 'rack-comp',
    templateUrl: '/assets/templates/rack.component.html',
    providers: [RackManager]
})

export class RackComponent implements OnInit {

    constructor(private rackManager: RackManager) {
        this.rackManager = rackManager;
    }

    ngOnInit() {

    }

    keyboardInput(event: KeyboardEvent) {
        let letter = event.key;
        console.log("lettre recue (rack): " + letter);
        this.rackManager.handleInput(letter);
    }
}
