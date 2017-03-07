/**
 * letter.ts - describes a letter on the board and/or rack
 *
 * @authors Félix Boulet, Pierre To
 * @date 2017/02/06
 */

export class Letter {
    private readonly letter: string;
    private readonly value: number;
    private texture: string;
    private selected: boolean;

    constructor(letter: string) {
        this.selected = false;
        this.letter = letter.charAt(0).toUpperCase();
        this.texture = "../../assets/textures/letters/" + this.letter + ".png";
        this.value = this.getLetterValue();
    }

    getLetter(): string {
        return this.letter;
    }

    getValue(): number {
        return this.value;
    }

    getTexture(): string {
        return this.texture;
    }

    setTexture(texture: string): void {
        this.texture = texture;
    }

    isSelected(): boolean {
        return this.selected;
    }

    toggleSelect(): void {
        this.selected = !this.selected;
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
        }

        return value;
    }
}
