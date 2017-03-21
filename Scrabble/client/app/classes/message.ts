/**
 * message.ts - describes a message displayed in the chat box
 *
 * @authors Pierre To and Mikael Ferland
 * @date 2017/03/11
 */

export interface IMessageFromServer {
    username: string;
    submessage: string;
    commandResponse?: string;
}

export class Message {
    private username = "";
    private submessage = "";
    private commandResponse = "";
    private isCommand = false;

    constructor(message: IMessageFromServer, isCommand = false) {
        this.username = message.username;
        this.submessage = message.submessage;

        if (message.commandResponse !== undefined) {
            this.commandResponse = message.commandResponse;
        }

        this.isCommand = isCommand;
    }

    public getUsername(): string {
        return this.username;
    }

    public getSubmessage(): string {
        return this.submessage;
    }

    public getCommandResponse(): string {
        return this.commandResponse;
    }

    public getIsCommand(): boolean {
        return this.isCommand;
    }
}
