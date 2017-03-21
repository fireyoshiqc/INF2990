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
    private empty: boolean;
    private bonusActive: boolean;

    constructor(tileType: TileType = "Basic") {
        this.tileType = tileType;
        this.empty = true;
        this.bonusActive = true;
    }

    public copyBoardTile(): BoardTile {
        let copyBoardTile = new BoardTile(this.tileType);
        copyBoardTile.letter = this.letter;
        copyBoardTile.empty = this.empty;
        copyBoardTile.bonusActive = this.bonusActive;

        return copyBoardTile;
    }

    public getTileType(): TileType {
        // Pour ne pas compter DoubleWord/TripleWord plus qu'une fois
        if (this.bonusActive === true) {
            return this.tileType;
        }
        return "Basic";
    }

    public getLetter(): Letter {
        return this.letter;
    }

    public isEmpty(): boolean {
        return this.empty;
    }

    public isBonusActive(): boolean {
        return this.bonusActive;
    }

    public putLetter(letter: Letter): void {
        this.letter = letter;
        this.empty = false;
    }

    public countTilePoint(): number {
        if (this.empty) {
            return 0;
        }

        let point = this.letter.getValue();
        if (this.tileType === "DoubleLetter" && this.bonusActive === true) {
            point *= 2;
        } else if (this.tileType === "TripleLetter" && this.bonusActive === true) {
            point *= 3;
        }

        this.bonusActive = false;
        return point;
    }
}
