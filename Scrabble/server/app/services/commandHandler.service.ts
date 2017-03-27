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
    private readonly commandResponseMessage =
    [
        "", // CommandExecutionStatus.SUCCESS
        "ERREUR : Il est impossible d'exécuter cette commande. Voir !aide", // CommandExecutionStatus.ERROR
        "ATTENTION : Veuillez attendre votre tour.", // CommandExecutionStatus.WAIT
        "ATTENTION : Veuillez patienter pendant la validation du plateau de jeu.", // CommandExecutionStatus.BLOCK
        "", // SUCCESS_PLACE_WORD_CAN_PLACE_WORD
        "ERREUR : Votre mot sort du plateau de jeu.", // CommandExecutionStatus.ERROR_PLACE_WORD_OUT_OF_BOUNDS
        "ERREUR : Votre mot remplace des lettres sur le plateau de jeu.", // ERROR_PLACE_WORD_INCORRECT_OVERLAPPING,
        "ERREUR : Votre mot ne touche pas la case centrale (premier tour).", // ERROR_PLACE_WORD_CENTRAL_TILE,
        "ERREUR : Votre mot ne touche pas une lettre sur le plateau de jeu.", // ERROR_PLACE_WORD_ADJACENT_TILE,
        "ERREUR : Des mots nouvellement formés sont invalides. Le tour est terminé.", // ERROR_PLACE_WORD_INVALID_WORDS
        "", // SUCCESS_CHANGE_LETTER_STASH_ENOUGH
        "ERREUR : La réserve de lettres est vide.", // ERROR_CHANGE_LETTER_STASH_EMPTY
        "", // SUCCESS_REMOVE_LETTERS
        "ERREUR : Vous n'avez pas les lettres requises sur votre chevalet." // ERROR_REMOVE_LETTERS
    ];

    constructor(sio: SocketIO.Server, rmanager: RoomManager) {
        this.sio = sio;
        this.roomManager = rmanager;
        this.commandParser = new CommandParser();
    }

    public isACommand(msg: string): boolean {
        return this.commandParser.isACommand(msg);
    }

    // Create a command
    // If command syntax is not valid or command is undefined : send a message with SocketIO
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
            this.sio.sockets.in(player.getRoomId().toString())
                .emit('command sent', { username: player.getName(), submessage: msg, commandResponse });
        }
    }

    // Execute a command with the GameMaster (each game Room contains a GameMaster)
    // If the execution failed : send a message with SocketID
    private executeCommand(msg: string, player: Player, command: Command): void {
        // Command is valid, execute it with the game master of the room
        let room = this.roomManager.findRoom(player.getRoomId());
        let executionStatus = room.getGameMaster().handleCommand(command, player);

        let commandResponse = "";
        switch (executionStatus) {
            case CommandExecutionStatus.SUCCESS:
                this.updateClient(msg, player, command);
                return;

            case CommandExecutionStatus.ERROR_PLACE_WORD_INVALID_WORDS:
                this.updateClientInvalidPlaceWord(msg, player, command);
                return;

            case CommandExecutionStatus.WAIT:
            case CommandExecutionStatus.BLOCK:
            case CommandExecutionStatus.ERROR:
            case CommandExecutionStatus.ERROR_PLACE_WORD_OUT_OF_BOUNDS:
            case CommandExecutionStatus.ERROR_PLACE_WORD_INCORRECT_OVERLAPPING:
            case CommandExecutionStatus.ERROR_PLACE_WORD_CENTRAL_TILE:
            case CommandExecutionStatus.ERROR_PLACE_WORD_ADJACENT_TILE:
            case CommandExecutionStatus.ERROR_CHANGE_LETTER_STASH_EMPTY:
            case CommandExecutionStatus.ERROR_REMOVE_LETTERS:
                commandResponse = this.commandResponseMessage[executionStatus];
                break;

            default:
                break;
        }

        // Writes the error message in the chat of all players
        this.sio.sockets.in(player.getRoomId().toString())
            .emit('command sent', { username: player.getName(), submessage: msg, commandResponse });
    }

    private updateClient(msg: string, player: Player, command: Command): void {
        switch (command.getCommandType()) {
            case CommandType.PLACER:
                this.updateClientPlaceWord(player, command);
                break;

            case CommandType.CHANGER:
                this.updateClientChangeLetter(player, command);
                break;

            case CommandType.PASSER:
                break;

            case CommandType.AIDE:
                this.updateClientHelp(msg, player);
                return;

            default:
                break;
        }

        // Writes the successful command in the chat of all players except for help
        this.sio.sockets
            .in(player.getRoomId().toString())
            .emit('command sent', { username: player.getName(), submessage: msg, commandResponse: "" });
    }

    private updateClientPlaceWord(player: Player, command: Command): void {
        let placeCommand = command as CommandPlaceWord;

        // Updates board (to all players)
        this.sio.sockets
            .in(player.getRoomId().toString())
            .emit('wcUpdateBoard', {
                row: placeCommand.getRow(), column: placeCommand.getColumn(),
                orientation: placeCommand.getOrientation(), word: placeCommand.getWord()
            });

        // Updates rack (to active player only)
        this.sio.sockets.connected[player.getSocketId()]
            .emit('wcUpdateRack', player.getLettersRack());
    }

    private updateClientInvalidPlaceWord(msg: string, player: Player, command: Command): void {
        // Writes the error message in the chat of all players
        let commandResponse = this.commandResponseMessage[CommandExecutionStatus.ERROR_PLACE_WORD_INVALID_WORDS];
        this.sio.sockets.connected[player.getSocketId()]
            .emit('command sent', { username: "Scrabble Game", submessage: msg, commandResponse });

        // Update the client's board and rack immediately even if newly formed words are invalid
        this.updateClientPlaceWord(player, command);

        let room = this.roomManager.findRoom(player.getRoomId());

        // Wait 3 seconds and remove letters from board, placed letters back to rack
        setTimeout(() => {
            // UndoPlaceWord returns a word in which letters to be returned to the player are indicated by "-"
            let placeCommand = command as CommandPlaceWord;
            let wordToUpdate = room.getGameMaster().undoPlaceWord(placeCommand, player); // Unblock active player

            placeCommand.setWord(wordToUpdate);
            this.updateClientPlaceWord(player, placeCommand);
        }, 3000);

        // Active player can't send additional command
        room.getGameMaster().blockActivePlayer();
    }

    private updateClientChangeLetter(player: Player, command: Command): void {
        // Updates rack (to active player only)
        this.sio.sockets.connected[player.getSocketId()]
            .emit('wcUpdateRack', player.getLettersRack());
    }

    private updateClientHelp(msg: string, player: Player): void {
        // Send help message
        this.sio.sockets.connected[player.getSocketId()]
            .emit('command sent', { username: "Scrabble Game", submessage: msg, commandResponse: Command.helpMessage });
    }
}
