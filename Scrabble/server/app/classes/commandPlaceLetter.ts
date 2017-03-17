/**
 * commandPlaceLetter.ts - implements the place letter command for a scrabble game
 *
 * @authors Mikael Ferland, Pierre To
 * @date 2017/03/11
 */

import { Command, CommandType, CommandStatus } from '../classes/command';

export class CommandPlaceWord extends Command {
    private row: string;
    private column: number;
    private orientation: string;
    private word: string;

    constructor(row: string, column: number, orientation: string, word: string) {
        super(CommandType.PLACER, CommandStatus.VALID_COMMAND);
        this.row = row;
        this.column = column;
        this.orientation = orientation;
        this.word = word;
    }

    getRow(): string {
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
