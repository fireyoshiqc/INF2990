/**
 * socketManager.service.ts
 *
 * @authors Félix Boulet
 * @date 2017/02/19
 * @modified by Mikael Ferland, Pierre To on 2017/03/07
 */

import * as io from 'socket.io';
import * as http from 'http';
import { Player } from '../classes/player';
import { RoomManager } from './roomManager.service';
import { PlayerManager } from './playerManager.service';
import { CommandParser } from './commandParser.service';
import { CommandType, CommandStatus } from '../classes/command';
import { CommandPlaceWord } from '../classes/commandPlaceWord';
import { CommandExecutionStatus } from './gameMaster.service';

export class SocketManager {
    sio: SocketIO.Server;
    rmanager: RoomManager;
    pmanager: PlayerManager;
    cparser: CommandParser;

    constructor(server: http.Server) {
        this.sio = io.listen(server);
        this.rmanager = new RoomManager();
        this.pmanager = new PlayerManager();
        this.cparser = new CommandParser();
    }

    handleSockets() {
        this.sio.on('connection', (socket) => {

            //TODO: Rework this whole thing.
            // let connectMsg = "User has connected to chat.";
            // this.sio.emit('user connect', { username: socket.id, submessage: connectMsg });

            socket.on('chat message', (msg: string) => {
                let player = this.pmanager.getPlayerFromSocketID(socket.id);

                if (player !== undefined) {
                    if (this.cparser.isACommand(msg)) {
                        this.parseCommand(msg, player, socket);
                    }
                    else {
                        // regular message
                        this.sio.sockets
                            .in(player.getRoomId().toString())
                            .emit('message sent', { username: player.getName(), submessage: msg });
                    }
                }

                //TODO: Use same socket, not new chat socket.
                console.log(msg);
            });

            //TODO: Rework the whole thing above.
            socket.on('disconnect', (msg: any) => {
                let player = this.pmanager.getPlayerFromSocketID(socket.id);

                if (player !== undefined) {
                    this.rmanager.leaveRoom(player.getName(), player.getRoomId());
                    this.pmanager.removePlayer(player.getName());
                    let disconnectMsg = "L'utilisateur a quitté la partie.";
                    this.sio.sockets
                        .in(player.getRoomId().toString())
                        .emit('user disconnect', { username: player.getName(), submessage: disconnectMsg });
                }
                console.log("User disconnected");
            });

            socket.on('cwValidateName', (name: string) => {
                let validity = this.pmanager.validateName(name);
                socket.emit('wcNameValidated', validity);
            });

            socket.on('cwAddPlayer', (player: any) => {
                // Find (or create) a room in room manager service
                let room = this.rmanager.createRoom(player.capacity);

                // Create a new player in the playerManager
                let newPlayer = this.pmanager.addPlayer(player.name, socket.id, room.getRoomInfo().roomID);

                // Allows client to join a specific room
                room.addPlayer(newPlayer);
                socket.join(room.getRoomInfo().roomID.toString());

                setTimeout(() => {
                    this.sio.emit('wcFindRoom', room.getRoomInfo(), player.name);
                }, 500);
            });

            // Allows client to leave a specific room
            socket.on('cwLeaveRoom', (player: any) => {
                this.rmanager.leaveRoom(player.name, player.roomID);
                this.pmanager.removePlayer(player.name);
                socket.leave(player.roomID.toString());
            });

            setInterval(() => {
                for (let room of this.rmanager.getExistingRooms()) {
                    let id = room.getRoomInfo().roomID as number;
                    this.sio.sockets.in(id.toString()).emit('wcRefresh', room.getRoomInfo());
                }
            }, 1000);

            // Initializes the scrabble game in a specific room
            socket.on('cwStartGame', (roomID: number) => {
                let room = this.rmanager.findRoom(roomID);
                let gameMaster = room.getGameMaster();

                if (!gameMaster.isGameStarted()) {
                    gameMaster.startGame();

                    let msg = "Jeu initialisé. Ordre des joueurs :";
                    gameMaster.getPlayers().forEach(player => {
                        msg += " " + player.getName();
                    });
                    msg += ". Joueur actif : " + gameMaster.getActivePlayer().getName() + ".";

                    this.sio.sockets
                        .in(roomID.toString())
                        .emit('message sent', { username: "GameMaster", submessage: msg });
                }
            });
        });

    }

    private parseCommand(msg: string, player: Player, playerSocket: SocketIO.Socket): void {
        let command = this.cparser.createCommand(msg);
        let commandResponse = "";

        if (command.getCommandStatus() === CommandStatus.VALID_COMMAND) {

            if (command.getCommandType() === CommandType.AIDE) {
                // TODO mettre un message d'aide pertinent
                commandResponse = "Voici l'aide...";
            } else {
                // Command is valid, execute it
                let room = this.rmanager.findRoom(player.getRoomId());
                let executionStatus = room.getGameMaster().handleCommand(command, player);

                switch (executionStatus) {
                    case CommandExecutionStatus.SUCCESS: {
                        commandResponse = "SUCCÈS";
                        if (command.getCommandType() === CommandType.PLACER) {
                            let placeCommand = command as CommandPlaceWord;
                            this.sio.sockets
                                .in(player.getRoomId().toString())
                                .emit('wcPlaceWord', {
                                    row: placeCommand.getRow(), column: placeCommand.getColumn(),
                                    orientation: placeCommand.getOrientation(), word: placeCommand.getWord()
                                });
                            this.sio.sockets
                                .in(player.getRoomId().toString())
                                .emit('command sent', {
                                    username: player.getName(), submessage: msg,
                                    commandResponse: commandResponse
                                });

                        }
                    }
                        break;

                    case CommandExecutionStatus.ERROR:
                        commandResponse = "ERREUR : Cette commande n'est pas valide.";
                        break;

                    case CommandExecutionStatus.WAIT:
                        commandResponse = "Veuillez attendre votre tour";
                        break;

                    default:
                        break;
                }
            }
        } else if (command.getCommandStatus() === CommandStatus.INVALID_COMMAND_SYNTAX) {
            commandResponse = "ERREUR : Cette commande ne respecte pas la syntaxe. Voir !aide";
        } else if (command.getCommandStatus() === CommandStatus.UNDEFINED_COMMAND) {
            commandResponse = "ERREUR : Cette commande n'existe pas. Voir !aide";
        }

        if (commandResponse !== "SUCCÈS") {
            playerSocket
                .emit('command sent', {
                    username: "GameMaster", submessage: msg,
                    commandResponse: commandResponse
                });
        }
    }
}
