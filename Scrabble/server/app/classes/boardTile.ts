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
    private canRemoveLetter: boolean;

    constructor(tileType: TileType = "Basic") {
        this.tileType = tileType;
        this.empty = true;
        this.bonusActive = true;
        this.canRemoveLetter = false;
    }

    public copyBoardTile(): BoardTile {
        let copyBoardTile = new BoardTile(this.tileType);
        copyBoardTile.letter = this.letter;
        copyBoardTile.empty = this.empty;
        copyBoardTile.bonusActive = this.bonusActive;

        return copyBoardTile;
    }

    public getTileType(): TileType {
        // Don't count DoubleWord/TripleWord more than once
        if (this.bonusActive) {
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

    public deactivateBonus(): void {
        this.bonusActive = false;
    }

    public getCanRemoveLetter(): boolean {
        return this.canRemoveLetter;
    }

    // Letter can be removed (in case newly formed words are invalid)
    public activateCanRemoveLetter(): void {
        this.canRemoveLetter = true;
    }

    public deactivateCanRemoveLetter(): void {
        this.canRemoveLetter = false;
    }

    public putLetter(letter: Letter): void {
        this.letter = letter;
        this.empty = false;
    }

    public removeLetter(): void {
        if (this.canRemoveLetter) {
            this.letter = null;
            this.empty = true;
            this.deactivateCanRemoveLetter();
        }
    }

    public countTilePoint(): number {
        if (this.empty) {
            return 0;
        }

        let point = this.letter.getValue();
        if (this.tileType === "DoubleLetter" && this.bonusActive) {
            point *= 2;
        } else if (this.tileType === "TripleLetter" && this.bonusActive) {
            point *= 3;
        }

        return point;
    }
}
