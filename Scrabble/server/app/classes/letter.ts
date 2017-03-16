/**
 * letter.ts - describes a letter on the board and/or rack
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/03/15
 */

export class Letter {
    private readonly letter: string;
    private readonly value: number;

    constructor(letter: string) {
        this.letter = letter.toUpperCase();
        this.value = this.getLetterValue();
    }

    getLetter(): string {
        return this.letter;
    }

    getValue(): number {
        return this.value;
    }

    private getLetterValue(): number {
        let value: number;

        if ("EAINORSTUL".includes(this.letter)) {
            value = 1;
        } else if ("DMG".includes(this.letter)) {
            value = 2;
        } else if ("BCP".includes(this.letter)) {
            value = 3;
        } else if ("FHV".includes(this.letter)) {
            value = 4;
        } else if ("JQ".includes(this.letter)) {
            value = 8;
        } else if ("KWXYZ".includes(this.letter)) {
            value = 10;
        } else if ("JOKER".includes(this.letter)) {
            value = 0;
        }

        return value;
    }
}
