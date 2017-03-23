/**
 * boardTile.ts - describes a tile on the scrabble board
 *
 * @authors Félix Boulet, Pierre To
 * @date 2017/02/05
 */

import { Letter } from './letter';

export type TileType =
    "Basic"
    | "DoubleLetter"
    | "TripleLetter"
    | "DoubleWord"
    | "TripleWord"
    | "Center";

export class BoardTile {
    private readonly tileType: TileType;
    private texture: string;
    private letter: Letter;

    constructor(tileType: TileType = "Basic") {
        this.tileType = tileType;
        this.texture = "../../assets/textures/board/" + this.tileType + ".png";
        this.letter = null;
    }

    public getTileType(): TileType {
        return this.tileType;
    }

    public getTexture(): string {
        return this.texture;
    }

    public setTexture(texture: string) {
        this.texture = texture;
    }

    public putLetter(letter: Letter): void {
        this.texture = letter.getTexture();
        this.letter = letter;
    }

    public getCharacter(): string {
        if (this.letter !== null && this.letter.isJokerUsedAsLetter() === true) {
            return this.letter.getCharacter();
        } else {
            return null;
        }
    }

    public removeLetter(): void {
        this.texture = "../../assets/textures/board/" + this.tileType + ".png";
    }
}
