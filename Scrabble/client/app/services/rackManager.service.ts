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

    private rack: Letter[];
    static readonly RACK_LENGTH = 7;
    private selectedIndex: number;

    constructor() {
        //TODO: Modify this so it picks letters from the letter stash
        this.rack = [new Letter("I"), new Letter("R"), new Letter("E"), new Letter("P"), new Letter("V"), new Letter("R"), new Letter("E")];
    }

    handleInput(letter: string): void {
        this.rack[0].toggleSelect();
    }

    getRackLetters(): Letter[] {
        return this.rack;
    }
}

