/**
 * commandParser.service.ts
 *
 * @authors Pierre To et Mikael Ferland
 * @date 2017/03/05
 */

export enum CommandType {
    PLACER,
    CHANGER,
    PASSER,
    AIDE
}

export interface Command {
    commandType: CommandType;
    msg: string;
}

export class CommandParser {
    private readonly EXISTING_COMMANDS = ["!placer", "!changer", "!passer", "!aide"];
    private readonly PLACE_LETTER_REGEX = /^(!placer)\s[a-oA-O](10|11|12|13|14|15|[1-9])[h|H|v|V]\s[a-zA-Z]{1,7}$/;
    private readonly CHANGE_LETTER_REGEX = /^(!changer)\s([a-z]|[*]){1,7}$/;

    private command = { commandType: 0, msg: "" };

    isACommand(msg: string): boolean {
        msg = msg.trim();

        if (msg[0] === '!') {
            let commandType = msg.split(' ', 1)[0];
            let index = this.EXISTING_COMMANDS.findIndex(existingCommand => existingCommand === commandType);

            if (index > -1) {
                this.command.commandType = index;
                this.command.msg = msg;
                return true;
            }
        }
        return false;
    }

    validatePlaceLetterSyntax(): boolean {
        return this.PLACE_LETTER_REGEX.test(this.command.msg);
    }

    validateChangeLetterSyntax(): boolean {
        return this.CHANGE_LETTER_REGEX.test(this.command.msg);
    }
}
