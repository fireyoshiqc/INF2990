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

    public getCharacter(): string {
        return this.letter;
    }

    public getTexture(): string {
        return this.texture;
    }

    public setTexture(texture: string): void {
        this.texture = texture;
    }

    public isSelected(): boolean {
        return this.selected;
    }

    public toggleSelect(): void {
        this.selected = !this.selected;
    }

}
