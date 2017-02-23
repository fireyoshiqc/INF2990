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
    private letter: Letter;
    private isEmpty: boolean;
    private texture: string;

    constructor(tileType: TileType = "Basic") {
        this.tileType = tileType;
        this.isEmpty = true;
        this.texture = "../../assets/textures/board/" + this.tileType + ".png";
    }

    getTileType(): TileType {
        return this.tileType;
    }

    getLetter(): Letter {
        return this.letter;
    }

    getIsEmpty(): boolean {
        return this.isEmpty;
    }

    getTexture(): string {
        return this.texture;
    }

    setTexture(texture: string) {
        this.texture = texture;
    }

    putLetter(letter: Letter): void {
        this.letter = letter;
        this.isEmpty = false;
        this.texture = letter.getTexture();
    }

    // TODO : Add method to count point form a single tile
    /*countPoint() : number {
        if (this.tileType.type === Type.DoubleLetter || this.tileType.type === Type.TripleLetter) {

        }
        return this.letter.value;
    }*/
}
