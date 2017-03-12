/**
 * commandChangeLetter.ts - implements the change letter command for a scrabble game
 *
 * @authors Mikael Ferland, Pierre To
 * @date 2017/03/11
 */

import { Command, CommandType, CommandStatus } from '../classes/command';

export class CommandChangeLetter extends Command {
    private letters: string;

    constructor(letters: string) {
        super(CommandType.CHANGER, CommandStatus.VALID_COMMAND);
        this.letters = letters;
    }

    getLetters(): string {
        return this.letters;
    }
}
