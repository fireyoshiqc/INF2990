/**
 * rackManager.service.ts
 *
 * @authors Mikael Ferland, Vincent Chassé
 * @date 2017/03/06
 */

import { Injectable } from '@angular/core';
import { Letter } from '../classes/letter';

@Injectable()
export class RackManager {

    static readonly RACK_LENGTH = 7;
    private rack: Letter[];
    private selectedIndex: number;

    constructor() {
        //TODO: Modify this so it picks letters from the letter stash
        this.rack = [new Letter("I"),
        new Letter("R"),
        new Letter("E"),
        new Letter("P"),
        new Letter("V"),
        new Letter("R"),
        new Letter("E")];
        this.selectedIndex = null;
    }

    handleInput(event: KeyboardEvent): void {
        if (this.isArrowKey(event)) {
            if (this.selectedIndex !== null) {
                let nextIndex = ((this.selectedIndex + ((event.key === "ArrowLeft") ? -1 : 1))
                    + RackManager.RACK_LENGTH) % RackManager.RACK_LENGTH;
                console.log(nextIndex);
                let temp = this.rack[nextIndex];
                this.rack[nextIndex] = this.rack[this.selectedIndex];
                this.rack[this.selectedIndex] = temp;
                this.selectedIndex = nextIndex;
            }
        } else {
            let letter = event.key.toUpperCase();
            let index = this.rack.findIndex((rackLetter) => letter === rackLetter.getLetter());

            if (index !== -1) {
                this.rack[index].toggleSelect();

                if (this.selectedIndex !== null) {
                    this.rack[this.selectedIndex].toggleSelect();
                }
                this.selectedIndex = index;
            }
        }


    }

    getRackLetters(): Letter[] {
        return this.rack;
    }

    private isArrowKey(event: KeyboardEvent): boolean {
        return event.key === "ArrowLeft" || event.key === "ArrowRight";
    }
}

