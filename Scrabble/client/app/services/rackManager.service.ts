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
        this.rack = [
            new Letter("I"),
            new Letter("R"),
            new Letter("E"),
            new Letter("P"),
            new Letter("JOKER"),
            new Letter("R"),
            new Letter("E")];
        this.selectedIndex = null;
    }

    handleInput(event: KeyboardEvent): void {
        if (this.isArrowKey(event) && this.selectedIndex !== null) {
            let nextIndex = ((this.selectedIndex + ((event.key === "ArrowLeft") ? -1 : 1))
                            + RackManager.RACK_LENGTH) % RackManager.RACK_LENGTH;

            let temp = this.rack[nextIndex];
            this.rack[nextIndex] = this.rack[this.selectedIndex];
            this.rack[this.selectedIndex] = temp;
            this.selectedIndex = nextIndex;
        } else {
            let letter = event.key.toUpperCase();

            if (letter === "*") {
                letter = "JOKER";
            }

            if (this.isLetterInRack(letter)) {
                let nextIndex = (this.selectedIndex !== null && this.rack[this.selectedIndex].getLetter() === letter) ?
                                (this.selectedIndex + 1) % RackManager.RACK_LENGTH : 0;

                while (this.rack[nextIndex].getLetter() !== letter) {
                    nextIndex = (nextIndex + 1) % RackManager.RACK_LENGTH;
                }

                this.rack[nextIndex].toggleSelect();

                if (this.selectedIndex !== null) {
                    this.rack[this.selectedIndex].toggleSelect();
                }

                this.selectedIndex = nextIndex;
            }
        }
    }

    getRackLetters(): Letter[] {
        return this.rack;
    }

    private isArrowKey(event: KeyboardEvent): boolean {
        return event.key === "ArrowLeft" || event.key === "ArrowRight";
    }

    private isLetterInRack(letter: string): boolean {
        return (this.rack.findIndex(r => r.getLetter() === letter) !== -1);
    }
}
