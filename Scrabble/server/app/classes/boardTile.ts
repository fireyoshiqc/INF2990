/**
 * boardTile.ts - describes a tile on the scrabble board
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/03/15
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

    constructor(tileType: TileType = "Basic") {
        this.tileType = tileType;
        this.isEmpty = true;
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

    putLetter(letter: Letter): void {
        this.letter = letter;
        this.isEmpty = false;
    }

    countPoint(): number {
        if (this.tileType === "DoubleLetter") {
            this.letter.getValue() * 2;
        } else if (this.tileType === "TripleLetter") {
            this.letter.getValue() * 3;
        }
        return this.letter.getValue();
    }
}
