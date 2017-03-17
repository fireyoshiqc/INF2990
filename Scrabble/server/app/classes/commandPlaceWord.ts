/**
 * commandPlaceLetter.ts - implements the place letter command for a scrabble game
 *
 * @authors Mikael Ferland, Pierre To, Vincent Chassé, Yawen Hou
 * @date 2017/03/11
 */

import { Command, CommandType, CommandStatus } from '../classes/command';

export class CommandPlaceWord extends Command {
    private row: number;
    private column: number;
    private orientation: string; // v: Vertical, h: Horizontal
    private word: string;

    constructor(row: string, column: number, orientation: string, word: string) {
        super(CommandType.PLACER, CommandStatus.VALID_COMMAND);
        this.row = "ABCDEFGHIJKLMNO".indexOf(row.toUpperCase());
        this.column = column - 1; // Column starts at 1
        this.orientation = orientation;
        this.word = word;
    }

    getRow(): number {
        return this.row;
    }

    getColumn(): number {
        return this.column;
    }

    getOrientation(): string {
        return this.orientation;
    }

    getWord(): string {
        return this.word;
    }
}
