/**
 * letter.ts - describes a letter on the board and/or rack
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/03/15
 */

export class Letter {
    private readonly character: string;
    private readonly value: number;

    constructor(letter: string) {
        this.character = letter.toUpperCase();
        this.value = this.getLetterValue();
    }

    getCharacter(): string {
        return this.character;
    }

    getValue(): number {
        return this.value;
    }

    private getLetterValue(): number {
        let value: number;

        if ("EAINORSTUL".includes(this.character)) {
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
        } else if ("JOKER".includes(this.character)) {
            value = 0;
        }

        return value;
    }
}
