/**
 * letter.ts - describes a letter on the board and/or rack
 *
 * @authors Félix Boulet, Pierre To
 * @date 2017/02/06
 */

export class Letter {
    letter: string;
    texture: string;
    value: number;
    constructor(letter: string, value: number) {
        this.letter = letter.charAt(0).toUpperCase();
        this.texture = "../../assets/textures/letters/" + this.letter + ".png";
        this.value = value;
    }
}
