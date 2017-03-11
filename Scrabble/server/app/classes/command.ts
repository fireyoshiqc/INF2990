/**
 * command.ts - implements a command for a scrabble game
 *
 * @authors Mikael Ferland, Pierre To
 * @date 2017/03/11
 */

export enum CommandType {
    PLACER,
    CHANGER,
    PASSER,
    AIDE
}

export enum CommandStatus {
    UNDEFINED_COMMAND, // command does not exist (see EXISTING_COMMAND)
    INVALID_COMMAND_SYNTAX, // command does not have proper syntax
    VALID_COMMAND
}

export class Command {
    commandType: CommandType;
    commandStatus: CommandStatus;

    constructor(commandType: CommandType, commandStatus: CommandStatus) {
        this.commandType = commandType;
        this.commandStatus = commandStatus;
    }
}

export class CommandPlaceLetter extends Command {
    row: string;
    column: number;
    orientation: string;
    word: string;

    constructor(commandType: CommandType, commandStatus: CommandStatus,
                row: string, column: number, orientation: string, word: string) {
        super(commandType, commandStatus);
        this.row = row;
        this.column = column;
        this.orientation = orientation;
        this.word = word;
    }
}

export class CommandChangeLetter extends Command {
    letters: string;

    constructor(commandType: CommandType, commandStatus: CommandStatus, letters: string) {
        super(commandType, commandStatus);
        this.letters = letters;
    }
}
