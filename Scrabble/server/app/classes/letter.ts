/**
 * letter.ts - describes a letter on the board and/or rack
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/03/15
 */

export class Letter {
    private readonly character: string;
    private readonly value: number;
    private jokerUsedAsLetter: boolean;

    // For JOKER :
    // - in player's rack : new Letter("JOKER")
    // - in scrabble board : new Letter("A", true)
    constructor(letter: string, jokerUsedAsLetter = false) {
        this.character = letter.toUpperCase();
        this.jokerUsedAsLetter = jokerUsedAsLetter;
        this.value = this.getLetterValue();
    }

    public getCharacter(): string {
        return this.character;
    }

    public getValue(): number {
        return this.value;
    }

    public isJokerUsedAsLetter(): boolean {
        return this.jokerUsedAsLetter;
    }

    private getLetterValue(): number {
        let value: number;

        if (this.jokerUsedAsLetter || this.character === "JOKER") {
            value = 0;
        } else if ("EAINORSTUL".includes(this.character)) {
            value = 1;
        } else if ("DMG".includes(this.character)) {
            value = 2;
        } else if ("BCP".includes(this.character)) {
            value = 3;
        } else if ("FHV".includes(this.character)) {
            value = 4;
        } else if ("JQ".includes(this.character)) {
            value = 8;
        } else if ("KWXYZ".includes(this.character)) {
            value = 10;
        }

        return value;
    }
}
