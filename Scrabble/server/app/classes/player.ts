/**
 * player.ts - describes a player in the game
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/03/15
 */

import { Letter } from './letter';

export class Player {
    private name: string;
    private socketId: string;
    private roomId: number;
    private points: number;
    private lettersRack: Letter[];
    private readonly LETTERS_RACK_SIZE = 7;

    constructor(name: string, socketId: string, roomId: number) {
        this.name = name;
        this.socketId = socketId;
        this.roomId = roomId;
        this.points = 0;
        this.lettersRack = [];
    }

    getName(): string {
        return this.name;
    }

    getSocketId(): string {
        return this.socketId;
    }

    getRoomId(): number {
        return this.roomId;
    }

    getPoints(): number {
        return this.points;
    }

    addPoints(points: number): void {
        this.points += points;
    }

    getLettersRack(): string[] {
        let lettersRackString = new Array<string>();
        this.lettersRack.forEach(letter => lettersRackString.push(letter.getCharacter()));
        return lettersRackString;
    }

    isRackEmpty(): boolean {
        return this.lettersRack.length === 0;
    }

    getMaxRackSize(): number {
        return this.LETTERS_RACK_SIZE;
    }

    addLetter(letter: Letter): void {
        if (this.lettersRack.length < this.LETTERS_RACK_SIZE) {
            this.lettersRack.push(letter);
        }
    }

    // try to remove the letters from the player's rack
    // return false if a letter could not be removed from the rack
    removeLetters(letters: string[]): boolean {
        // save the old rack (deep copy)
        let oldRack = new Array<Letter>();
        this.lettersRack.forEach(letter => oldRack.push(new Letter(letter.getCharacter())));
        let lettersCanBeRemoved = true;

        letters.forEach(letter => {
            let letterIndex = this.lettersRack.findIndex(l => l.getCharacter() === letter.toUpperCase());

            if (letterIndex > -1) {
                this.lettersRack.splice(letterIndex, 1);
            } else {
                this.lettersRack = oldRack;
                lettersCanBeRemoved = false;
            }
        });

        return lettersCanBeRemoved;
    }
}
