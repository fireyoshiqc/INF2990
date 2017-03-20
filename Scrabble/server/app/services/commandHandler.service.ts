/**
 * commandHandler.service.ts
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/03/17
 */

import { Player } from '../classes/player';
import { RoomManager } from './roomManager.service';
import { CommandParser } from './commandParser.service';
import { Command, CommandType, CommandStatus } from '../classes/command';
import { CommandPlaceWord } from '../classes/commandPlaceWord';
import { CommandExecutionStatus } from './gameMaster.service';

export class CommandHandler {
    private sio: SocketIO.Server;
    private roomManager: RoomManager;
    private commandParser: CommandParser;

    constructor(sio: SocketIO.Server, rmanager: RoomManager) {
        this.sio = sio;
        this.roomManager = rmanager;
        this.commandParser = new CommandParser();
    }

    public isACommand(msg: string): boolean {
        return this.commandParser.isACommand(msg);
    }

    public handleCommand(msg: string, player: Player): void {
        let command = this.commandParser.createCommand(msg);
        let commandResponse = "";
        let commandStatus = command.getCommandStatus();

        if (commandStatus === CommandStatus.VALID_COMMAND) {
            this.executeCommand(msg, player, command);
        } else if (commandStatus === CommandStatus.INVALID_COMMAND_SYNTAX) {
            commandResponse = "ERREUR : Cette commande ne respecte pas la syntaxe. Voir !aide";
        } else if (commandStatus === CommandStatus.UNDEFINED_COMMAND) {
            commandResponse = "ERREUR : Cette commande n'existe pas. Voir !aide";
        }

        if (commandStatus !== CommandStatus.VALID_COMMAND) {
            this.sio.sockets.connected[player.getSocketId()]
                .emit('command sent', { username: "Scrabble Game", submessage: msg, commandResponse });
        }
    }

    private executeCommand(msg: string, player: Player, command: Command): void {
        // Command is valid, execute it with the game master of the room
        let room = this.roomManager.findRoom(player.getRoomId());
        let executionStatus = room.getGameMaster().handleCommand(command, player);

        let commandResponse = "";
        switch (executionStatus) {
            case CommandExecutionStatus.SUCCESS:
                this.onSuccessfulExecution(msg, player, command);
                break;

            case CommandExecutionStatus.ERROR:
                commandResponse = "ERREUR : Il est impossible d'exécuter cette commande.";
                break;

            case CommandExecutionStatus.WAIT:
                commandResponse = "ERREUR : Veuillez attendre votre tour";
                break;

            default:
                break;
        }

        if (executionStatus !== CommandExecutionStatus.SUCCESS) {
            this.sio.sockets.connected[player.getSocketId()]
                .emit('command sent', { username: "Scrabble Game", submessage: msg, commandResponse });
        }
    }

    private onSuccessfulExecution(msg: string, player: Player, command: Command): void {
        switch (command.getCommandType()) {
            case CommandType.PLACER:
                this.onPlaceWordSuccessful(player, command);
                break;

            case CommandType.CHANGER:
                this.onChangeLetterSuccessful(player, command);
                break;

            case CommandType.PASSER:
                // TODO : Si vous avez une fonction pour avertir le client d'un changement, faites-le ici
                break;

            case CommandType.AIDE:
                this.onHelpSuccessful(msg, player);
                return;

            default:
                break;
        }

        // Writes the successful command in the chat of all players except for help
        this.sio.sockets
            .in(player.getRoomId().toString())
            .emit('command sent', { username: player.getName(), submessage: msg, commandResponse: "" });
    }

    private onPlaceWordSuccessful(player: Player, command: Command): void {
        let placeCommand = command as CommandPlaceWord;

        // Updates board (to all players)
        this.sio.sockets
            .in(player.getRoomId().toString())
            .emit('wcPlaceWord', {
                row: placeCommand.getRow(), column: placeCommand.getColumn(),
                orientation: placeCommand.getOrientation(), word: placeCommand.getWord()
            });

        // Updates rack (to active player only)
        this.sio.sockets.connected[player.getSocketId()]
            .emit('wcUpdateRack', player.getLettersRack());
    }

    private onChangeLetterSuccessful(player: Player, command: Command): void {
        // Updates rack (to active player only)
        this.sio.sockets.connected[player.getSocketId()]
            .emit('wcUpdateRack', player.getLettersRack());
    }

    private onHelpSuccessful(msg: string, player: Player): void {
        // TODO mettre un message d'aide pertinent
        let helpMessage = "Voici l'aide...";
        // VOIR LES REGEX (ex. pour placer un mot, le mot doit être en 2 à 15 lettres (requis)
        // AUSSI, le mot doit être formé avec des lettres du rack,
        // Mais aussi TENIR compte des lettres qui sont sur le plateau, d'où jusqu'à 15 lettres)

        this.sio.sockets.connected[player.getSocketId()]
            .emit('command sent', { username: "Scrabble Game", submessage: msg, commandResponse: helpMessage });
    }
}
