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

    constructor(tileType: TileType = "Basic") {
        this.tileType = tileType;
        this.texture = "../../assets/textures/board/" + this.tileType + ".png";
    }

    getTileType(): TileType {
        return this.tileType;
    }

    getTexture(): string {
        return this.texture;
    }

    setTexture(texture: string) {
        this.texture = texture;
    }

    putLetter(letter: Letter): void {
        this.texture = letter.getTexture();
    }
}
