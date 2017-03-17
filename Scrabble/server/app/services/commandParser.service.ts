/**
 * commandParser.service.ts
 *
 * @authors Pierre To et Mikael Ferland
 * @date 2017/03/05
 */

import { Command, CommandType, CommandStatus } from '../classes/command';
import { CommandPlaceWord } from '../classes/commandPlaceWord';
import { CommandChangeLetter } from '../classes/commandChangeLetter';

export class CommandParser {
    private readonly EXISTING_COMMANDS = ["!placer", "!changer", "!passer", "!aide"];
    private readonly PLACE_LETTER_REGEX =
        /^(!placer)\s([a-oA-O])(10|11|12|13|14|15|[1-9])([h|H|v|V])\s([a-zA-Z]{1,7})$/;
    private readonly CHANGE_LETTER_REGEX = /^(!changer)\s([a-z*]{1,7})$/;
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

        // create specific commands (with supplied parameters) if command is valid
        if (commandStatus === CommandStatus.VALID_COMMAND) {
            if (commandTypeIndex === CommandType.PLACER) {
                return this.createCommandPlaceWord(msg);
            } else if (commandTypeIndex === CommandType.CHANGER) {
                return this.createCommandChangeLetter(msg);
            }
        }

        return new Command(commandTypeIndex, commandStatus);
    }

    private createCommandPlaceWord(msg: string): CommandPlaceWord {
        msg = msg.trim();

        // obtain command arguments with regex
        let placeLetterArgs = msg.match(this.PLACE_LETTER_REGEX);
        let row = placeLetterArgs[2].toLowerCase();
        let column = Number.parseInt(placeLetterArgs[3]);
        let orientation = placeLetterArgs[4].toLowerCase();
        let word = placeLetterArgs[5];

        return new CommandPlaceWord(row, column, orientation, word);
    }

    private createCommandChangeLetter(msg: string): CommandChangeLetter {
        msg = msg.trim();

        // obtain command arguments with regex
        let changeLetterArgs = msg.match(this.CHANGE_LETTER_REGEX);
        let letters = changeLetterArgs[2];

        return new CommandChangeLetter(letters);
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
