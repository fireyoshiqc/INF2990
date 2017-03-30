/**
 * player.ts - describes a player in the game
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/03/15
 */

import { Letter } from './letter';
import { CommandExecutionStatus } from '../services/gameMaster.service';

export class Player {
    private name: string;
    private socketId: string;
    private roomId: number;
    private points: number;
    private lettersRack: Letter[];
    private readonly LETTERS_RACK_SIZE = 7;
    private isBlocked: boolean;

    constructor(name: string, socketId: string, roomId: number) {
        this.name = name;
        this.socketId = socketId;
        this.roomId = roomId;
        this.points = 0;
        this.lettersRack = [];
        this.isBlocked = false;
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

    public getIsBlocked(): boolean {
        return this.isBlocked;
    }

    public setBlocked(blocked: boolean): void {
        this.isBlocked = blocked;
    }

    public setLetters(letters: Array<Letter>): void {
        this.lettersRack = letters;
    }

    public addLetters(letters: Array<Letter>): void {
        if (this.lettersRack.length + letters.length <= this.LETTERS_RACK_SIZE) {
            this.lettersRack = this.lettersRack.concat(letters);
        }
    }

    // Try to remove the letters from the player's rack
    // Return false if a letter could not be removed from the rack
    public removeLetters(letters: string[]): CommandExecutionStatus {
        // Save the old rack (deep copy)
        let oldRack = this.backupRack();

        letters = this.mapJokers(letters);

        for (let i = 0; i < letters.length; i++) {
            let letterIndex = this.lettersRack.findIndex(l => l.getCharacter() === letters[i].toUpperCase());

            if (letterIndex > -1) {
                this.lettersRack.splice(letterIndex, 1);
            } else {
                this.lettersRack = oldRack;
                return CommandExecutionStatus.ERROR_REMOVE_LETTERS;
            }
        }

        return CommandExecutionStatus.SUCCESS_REMOVE_LETTERS;
    }

    private backupRack(): Letter[] {
        let oldRack = new Array<Letter>();
        this.lettersRack.forEach(letter => oldRack.push(new Letter(letter.getCharacter())));
        return oldRack;
    }

    private mapJokers(letters: Array<string>): Array<string> {
        return letters.map(letter => {
            return letter === "*" ? "JOKER" : letter;
        });

    }
}
