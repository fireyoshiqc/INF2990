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
    UNDEFINED_COMMAND, // Command does not exist (see EXISTING_COMMAND)
    INVALID_COMMAND_SYNTAX, // Command does not have proper syntax
    VALID_COMMAND
}


export class Command {
    private commandType: CommandType;
    private commandStatus: CommandStatus;

    constructor(commandType: CommandType, commandStatus: CommandStatus) {
        this.commandType = commandType;
        this.commandStatus = commandStatus;
    }

    public getCommandType(): CommandType {
        return this.commandType;
    }

    public getCommandStatus(): CommandStatus {
        return this.commandStatus;
    }
}
