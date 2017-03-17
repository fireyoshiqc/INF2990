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
import { CommandType, CommandStatus } from '../classes/command';
import { GameMaster, CommandExecutionStatus } from './gameMaster.service';

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
            // let connectMsg = "User has connected to chat.";
            // this.sio.emit('user connect', { username: socket.id, submessage: connectMsg });

            socket.on('chat message', (msg: string) => {
                let player = this.pmanager.getSocketName(socket.id);

                if (player !== undefined) {
                    if (this.cparser.isACommand(msg)) {
                        this.parseCommand(msg, player);
                    }
                    else {
                        // regular message
                        this.sio.sockets
                            .in(player.roomId.toString())
                            .emit('message sent', { username: player.name, submessage: msg });
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
                    this.sio.sockets
                            .in(player.roomId.toString())
                            .emit('user disconnect', { username: player.name, submessage: disconnectMsg });
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

                this.pmanager.addPlayer({ roomId: room.getRoomInfo().roomID, name: player.name, socketId: socket.id });

                // Allows client to join a specific room
                socket.join(room.getRoomInfo().roomID.toString());

                setTimeout(() => {
                    this.sio.emit('wcFindRoom', room.getRoomInfo(), player.name);
                }, 500);
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

        if (command.getCommandStatus() === CommandStatus.VALID_COMMAND) {

            if (command.getCommandType() === CommandType.AIDE) {
                // TODO mettre un message d'aide pertinent
                commandResponse = "Voici l'aide...";
            } else {
                // Command is valid, execute it -- CHANGER PLAYER INTERFACE EN PLAYER (CLASSE) !!!
                //let executionStatus = this.gmaster.handleCommand(command, player); <===================
                //commandResponse = (executionStatus === CommandExecutionStatus.SUCCESS) ?
                    // TODO changer le message d'erreur lorsque les commandes sont implémentées
                    //"" : "ERREUR : Cette commande n'est pas encore implémentée. TODO changer le msg.";
            }

        } else if (command.getCommandStatus() === CommandStatus.INVALID_COMMAND_SYNTAX) {
            commandResponse = "ERREUR : Cette commande ne respecte pas la syntaxe. Voir !aide";
        } else if (command.getCommandStatus() === CommandStatus.UNDEFINED_COMMAND) {
            commandResponse = "ERREUR : Cette commande n'existe pas. Voir !aide";
        }

        this.sio.sockets
            .in(player.roomId.toString())
            .emit('command sent', { username: player.name, submessage: msg, commandResponse: commandResponse });
    }
}
