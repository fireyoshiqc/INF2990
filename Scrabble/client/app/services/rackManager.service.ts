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

    private rackLength = 7;
    private rack: Letter[];
    private selectedIndex: number;

    constructor() {
        this.rack = [
            new Letter("JOKER"),
            new Letter("JOKER"),
            new Letter("JOKER"),
            new Letter("JOKER"),
            new Letter("JOKER"),
            new Letter("JOKER"),
            new Letter("JOKER")];
        this.selectedIndex = null;
    }

    public handleInput(event: KeyboardEvent): void {
        this.rackLength = this.rack.length;

        if (this.isArrowKey(event) && this.selectedIndex !== null) {
            // 1- Select new index
            let nextIndex = ((this.selectedIndex + ((event.key === "ArrowLeft") ? -1 : 1))
                + this.rackLength) % this.rackLength;

            // 2.1- If the selected letter is on the left end of the rack and is moved to the left
            if (nextIndex === (this.rackLength - 1) && this.selectedIndex === 0) {
                this.rack = this.rack.concat(this.rack.splice(0, 1)); // Left shift letters on rack
            }
            // 2.2- If the selected letter is on the right end of the rack and is moved to the right
            else if (nextIndex === 0 && this.selectedIndex === (this.rackLength - 1)) {
                this.rack = this.rack.concat(this.rack.splice(0, this.rackLength - 1)); // Right shift letters on rack
            }
            // 2.3- If the letter is moved between the boundaries of the rack
            else {
                let temp = this.rack[nextIndex];
                this.rack[nextIndex] = this.rack[this.selectedIndex];
                this.rack[this.selectedIndex] = temp;
            }

            // 3- Save the new index
            this.selectedIndex = nextIndex;
        } else {
            let letter = event.key.toUpperCase();

            if (letter === "*") {
                letter = "JOKER";
            }

            if (this.isLetterInRack(letter)) {
                let nextIndex = (this.selectedIndex !== null &&
                    this.rack[this.selectedIndex].getCharacter() === letter) ?
                    (this.selectedIndex + 1) % this.rackLength : 0;

                while (this.rack[nextIndex].getCharacter() !== letter) {
                    nextIndex = (nextIndex + 1) % this.rackLength;
                }

                this.rack[nextIndex].toggleSelect();

                if (this.selectedIndex !== null) {
                    this.rack[this.selectedIndex].toggleSelect();
                }

                this.selectedIndex = nextIndex;
            } else {
                this.deselectLetter();
            }
        }
    }

    public getRackLetters(): Letter[] {
        return this.rack;
    }

    public updateRack(letters: string[]): void {
        this.deselectLetter();

        let newRack = new Array<Letter>();
        letters.forEach(letter => {
            newRack.push(new Letter(letter));
        });
        this.rack = newRack;
    }

    public deselectLetter(): void {
        if (this.selectedIndex !== null) {
            this.rack[this.selectedIndex].toggleSelect();
            this.selectedIndex = null;
        }
    }

    private isArrowKey(event: KeyboardEvent): boolean {
        return event.key === "ArrowLeft" || event.key === "ArrowRight";
    }

    private isLetterInRack(letter: string): boolean {
        return (this.rack.findIndex(r => r.getCharacter() === letter) !== -1);
    }

    public getSelectedIndex(): number {
        return this.selectedIndex;
    }

    public setSelectedIndex(selectedIndex: number): void {
        this.selectedIndex = selectedIndex;
    }
}
