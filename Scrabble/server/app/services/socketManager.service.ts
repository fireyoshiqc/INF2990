/**
 * socketManager.service.ts
 *
 * @authors Félix Boulet
 * @date 2017/02/19
 * @modified by Mikael Ferland, Pierre To on 2017/03/07
 */

import * as io from 'socket.io';
import * as http from 'http';
import { RoomManager } from './roomManager.service';
import { PlayerManager, Player } from './playerManager.service';
import { CommandParser } from './commandParser.service';
import { Command, CommandType, CommandStatus, CommandPlaceLetter, CommandChangeLetter } from '../classes/command';
import { GameMaster } from './gameMaster.service';

export class SocketManager {
    sio: SocketIO.Server;
    rmanager: RoomManager;
    pmanager: PlayerManager;
    cparser: CommandParser;
    gmaster: GameMaster;

    constructor(server: http.Server) {
        this.sio = io.listen(server);
        this.rmanager = new RoomManager();
        this.pmanager = new PlayerManager();
        this.cparser = new CommandParser();
        this.gmaster = new GameMaster();
    }

    handleSockets() {
        this.sio.on('connection', (socket) => {

            //TODO: Rework this whole thing.
            console.log("User connected");
            let connectMsg = "User has connected to chat.";
            this.sio.emit('user connect', { username: socket.id, submessage: connectMsg });

            socket.on('chat message', (msg: string) => {
                let player = this.pmanager.getSocketName(socket.id);

                if (player !== undefined) {
                    if (this.cparser.isACommand(msg)) {
                        this.parseCommand(msg, player);
                    }
                    else {
                        // regular message
                        this.sio.emit('message sent', { username: player.name, submessage: msg });
                    }
                }

                //TODO: Use same socket, not new chat socket.
                console.log(msg);
            });

            //TODO: Rework the whole thing above.
            socket.on('disconnect', (msg: any) => {
                let player = this.pmanager.getSocketName(socket.id);
                if (player !== undefined) {
                    this.pmanager.removePlayer(player.name);
                    this.rmanager.leaveRoom(player);
                    let disconnectMsg = "L'utilisateur a quitté la partie.";
                    this.sio.emit('user disconnect', { username: player.name, submessage: disconnectMsg });
                }
                console.log("User disconnected");
            });

            socket.on('cwValidateName', (name: string) => {
                let validity = this.pmanager.validateName(name);
                socket.emit('wcNameValidated', validity);
            });

            socket.on('cwAddPlayer', (player: any) => {
                // Find (or create) a room in room manager service
                let room = this.rmanager.joinRoom(player);
                setTimeout(() => {
                    this.sio.emit('wcFindRoom', room.getRoomInfo(), player.name);
                }, 500);
            });

            // Allows client to join a specific room
            socket.on('cwJoinRoom', (roomID: number, playerName: string) => {
                this.pmanager.addPlayer({ roomId: roomID, name: playerName, socketId: socket.id });
                socket.join(roomID.toString());
            });

            // Allows client to leave a specific room
            socket.on('cwLeaveRoom', (player: any) => {
                this.rmanager.leaveRoom(player);
                this.pmanager.removePlayer(player.name);
                socket.leave(player.roomID.toString());
            });

            setInterval(() => {
                for (let room of this.rmanager.getExistingRooms()) {
                    let id = room.getRoomInfo().roomID as number;
                    this.sio.sockets.in(id.toString()).emit('wcRefresh', room.getRoomInfo());
                }
            }, 1000);
        });

    }

    private parseCommand(msg: string, player: Player): void {
        let command = this.cparser.createCommand(msg);
        let commandResponse = "";

        if (command.commandStatus === CommandStatus.VALID_COMMAND) {
            if (command.commandType === CommandType.AIDE) {
                // TODO mettre un message d'aide pertinent
                commandResponse = " Voici l'aide...";
            } else if (command.commandType === CommandType.PLACER) {
                let cmd = this.cparser.createCommandPlaceLetter(msg);
                commandResponse = cmd.commandType + " " + cmd.commandStatus + " "
                                + cmd.row + cmd.column + cmd.orientation + " " + cmd.word;
                // this.gmaster.handleCommand(command);
            } else if (command.commandType === CommandType.CHANGER) {
                let cmd = this.cparser.createCommandChangeLetter(msg);
                commandResponse = cmd.commandType + " " + cmd.commandStatus + " " + cmd.letters;
                // this.gmaster.handleCommand(command);
            } else if (command.commandType === CommandType.PASSER) {
                commandResponse = command.commandType + " " + command.commandStatus + " PASSER";
                // this.gmaster.handleCommand(command);
            }
        } else if (command.commandStatus === CommandStatus.INVALID_COMMAND_SYNTAX) {
            commandResponse = "ERREUR : Cette commande ne respecte pas la syntaxe. Voir !aide";
        } else if (command.commandStatus === CommandStatus.UNDEFINED_COMMAND) {
            commandResponse = "ERREUR : Cette commande n'existe pas. Voir !aide";
        }

        this.sio.emit('command sent', { username: player.name, submessage: msg, commandResponse: commandResponse });
    }
}
