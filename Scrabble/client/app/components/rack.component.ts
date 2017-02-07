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
        <div id="rack">
            <table>
                <tr>
                    <td *ngFor="let letter of rack; let i = index">
                        <img src = {{letter.texture}} height = 100% width = 100%>
                    </td>
                </tr>
            </table>
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
