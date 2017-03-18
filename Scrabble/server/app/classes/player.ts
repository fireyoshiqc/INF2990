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

    getLettersRack(): Letter[] {
        return this.lettersRack;
    }

    isRackEmpty(): boolean {
        return this.lettersRack.length === 0;
    }

    getMaxRackSize(): number {
        return this.LETTERS_RACK_SIZE;
    }

    addLetter(letter: Letter): boolean {
        if (this.lettersRack.length < this.LETTERS_RACK_SIZE) {
            this.lettersRack.push(letter);
            return true;
        }

        return false;
    }

    removeLetters(letters: string[]): boolean {
        let lettersRemoved = true;
        letters.forEach(letter => {
            let letterIndex = this.lettersRack.findIndex(l => l.getCharacter() === letter);

            if (letterIndex === -1) {

                lettersRemoved = false;
            } else {
                this.lettersRack.splice(letterIndex, 1);
            }
        });

        return lettersRemoved;
    }
}
