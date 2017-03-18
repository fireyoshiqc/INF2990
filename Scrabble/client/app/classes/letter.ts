/**
 * letter.ts - describes a letter on the board and/or rack
 *
 * @authors Félix Boulet, Pierre To
 * @date 2017/02/06
 */

export class Letter {
    private readonly letter: string;
    private texture: string;
    private selected: boolean;

    constructor(letter: string) {
        this.selected = false;
        this.letter = letter.toUpperCase();
        this.texture = "../../assets/textures/letters/" + this.letter + ".png";
    }

    getCharacter(): string {
        return this.letter;
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

}
