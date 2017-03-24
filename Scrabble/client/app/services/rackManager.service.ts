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

    public static readonly RACK_LENGTH = 7;
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
                let nextIndex = (this.selectedIndex !== null &&
                    this.rack[this.selectedIndex].getCharacter() === letter) ?
                    (this.selectedIndex + 1) % RackManager.RACK_LENGTH : 0;

                while (this.rack[nextIndex].getCharacter() !== letter) {
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
