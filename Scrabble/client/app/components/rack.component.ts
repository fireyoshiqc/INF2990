/**
 * rack.component.ts
 *
 * @authors Félix Boulet, Pierre To
 * @date 2017/02/06
 */

import { Component, OnInit } from '@angular/core';

import { Letter } from '../classes/letter';

@Component({
    selector: 'rack-comp',
    template: `
    <div id="rack" class="flex-container" fxLayout="row" fxLayout.xs="column"
     fxLayoutAlign="center center" fxLayoutAlign.xs="start">
      <div class="flex-item" fxFlex="100%" fxFlex.xs="100%" fxFlexFill>
        <md-grid-list cols="7" rows="1">
          <md-grid-tile *ngFor="let letter of rack; let i = index" [colspan]="1" [rowspan]="1">
            <img src = {{letter.texture}} height = 100% width = 100%>
          </md-grid-tile>
        </md-grid-list>
      </div>
    </div>
    `
})

export class RackComponent implements OnInit {
    rack: Letter[];
    readonly RACK_LENGTH = 7;

    ngOnInit() {
        this.rack = [];

        //TODO: Modify this so it picks letters from the letter stash
        for (let i = 0; i < this.RACK_LENGTH; i++) {
            this.rack[i] = new Letter("A", 1);
        }
    }
}
