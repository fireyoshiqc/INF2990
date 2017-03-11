/**
 * commandParser.service.ts
 *
 * @authors Pierre To et Mikael Ferland
 * @date 2017/03/05
 */

import { Command, CommandType, CommandStatus, CommandPlaceLetter, CommandChangeLetter } from '../classes/command';

export class CommandParser {
    private readonly EXISTING_COMMANDS = ["!placer", "!changer", "!passer", "!aide"];
    private readonly PLACE_LETTER_REGEX = /^(!placer)\s[a-oA-O](10|11|12|13|14|15|[1-9])[h|H|v|V]\s[a-zA-Z]{1,7}$/;
    private readonly CHANGE_LETTER_REGEX = /^(!changer)\s([a-z]|[*]){1,7}$/;
    private readonly SKIP_TURN_REGEX = /^(!passer)$/;
    private readonly HELP_REGEX = /^(!aide)$/;

    isACommand(msg: string): boolean {
        let trimMsg = msg.trim();

        // A command should always start with "!"
        return (trimMsg[0] === '!');
    }

    createCommand(msg: string): Command {
        // A command contains a message, a type and a status
        msg = msg.trim();

        let commandType = msg.split(' ', 1)[0];
        let commandTypeIndex = this.EXISTING_COMMANDS.findIndex(existingCommand => existingCommand === commandType);

        let commandStatus = this.validateCommand(msg, commandTypeIndex);

        return new Command(commandTypeIndex, commandStatus);
    }

    createCommandPlaceLetter(msg: string): CommandPlaceLetter {
        msg = msg.trim();
        let row = msg.substring(8, 9);
        let column = Number.parseInt(msg.substr(9, 11));
        let orientation = (column > 9) ? msg.substr(11, 12) : msg.substr(10, 11);
        let word = msg.substring(12).trim();

        return new CommandPlaceLetter(CommandType.PLACER, CommandStatus.VALID_COMMAND,
                                      row, column, orientation, word);
    }

    createCommandChangeLetter(msg: string): CommandChangeLetter {
        msg = msg.trim();
        let letters = msg.substring(9);

        return new CommandChangeLetter(CommandType.CHANGER, CommandStatus.VALID_COMMAND, letters);
    }

    private validateCommand(msg: string, commandType: CommandType): CommandStatus {
        let validSyntax = false;

        switch (commandType) {
            case CommandType.PLACER :
                validSyntax = this.validatePlaceLetterSyntax(msg);
                break;
            case CommandType.CHANGER :
                validSyntax = this.validateChangeLetterSyntax(msg);
                break;
            case CommandType.PASSER :
                validSyntax = this.validateSkipTurnSyntax(msg);
                break;
            case CommandType.AIDE :
                validSyntax = this.validateHelpSyntax(msg);
                break;
            default : // command was not found
                return CommandStatus.UNDEFINED_COMMAND;
        }

        return (validSyntax) ? CommandStatus.VALID_COMMAND : CommandStatus.INVALID_COMMAND_SYNTAX;
    }

    private validatePlaceLetterSyntax(msg: string): boolean {
        return this.PLACE_LETTER_REGEX.test(msg);
    }

    private validateChangeLetterSyntax(msg: string): boolean {
        return this.CHANGE_LETTER_REGEX.test(msg);
    }

    private validateSkipTurnSyntax(msg: string): boolean {
        return this.SKIP_TURN_REGEX.test(msg);
    }

    private validateHelpSyntax(msg: string): boolean {
        return this.HELP_REGEX.test(msg);
    }
}
