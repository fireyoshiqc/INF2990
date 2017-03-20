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

    public getName(): string {
        return this.name;
    }

    public getSocketId(): string {
        return this.socketId;
    }

    public getRoomId(): number {
        return this.roomId;
    }

    public getPoints(): number {
        return this.points;
    }

    public addPoints(points: number): void {
        this.points += points;
    }

    public getLettersRack(): string[] {
        let lettersRackString = new Array<string>();
        this.lettersRack.forEach(letter => lettersRackString.push(letter.getCharacter()));
        return lettersRackString;
    }

    public isRackEmpty(): boolean {
        return this.lettersRack.length === 0;
    }

    public getMaxRackSize(): number {
        return this.LETTERS_RACK_SIZE;
    }

    public addLetter(letter: Letter): void {
        if (this.lettersRack.length < this.LETTERS_RACK_SIZE) {
            this.lettersRack.push(letter);
        }
    }

    public addLetters(letters: Array<Letter>): void {
        if (this.lettersRack.length + letters.length <= this.LETTERS_RACK_SIZE) {
            this.lettersRack = this.lettersRack.concat(letters);
        }
    }

    // Try to remove the letters from the player's rack
    // Return false if a letter could not be removed from the rack
    public removeLetters(letters: string[]): boolean {
        // Save the old rack (deep copy)
        let oldRack = new Array<Letter>();
        this.lettersRack.forEach(letter => oldRack.push(new Letter(letter.getCharacter())));
        let lettersCanBeRemoved = true;

        letters = letters.map(letter => {
            return letter === "*" ? "JOKER" : letter;
        });

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
