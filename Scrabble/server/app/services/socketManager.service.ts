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
import { CommandParser, CommandStatus } from './commandParser.service';

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
            console.log("User connected");
            this.sio.emit('user connect', socket.id + "~ User has connected to chat.");

            socket.on('chat message', (msg: string) => {
                let player = this.pmanager.getSocketName(socket.id);

                if (player !== undefined) {
                    if (this.cparser.isACommand(msg)) {
                        this.parseCommand(msg, player);
                    }
                    else {
                        // regular message
                        this.sio.emit('message sent', player.name + " ~ " + msg);
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
                    this.sio.emit('user disconnect', player.name + "~ L'utilisateur a quitté la partie.");
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

        if (command.commandStatus === CommandStatus.VALID_COMMAND) {
            // Appel de gameMaster pour l'exécution de la commande
            msg += "\nAppel à gameMaster pour exécution";
        } else if (command.commandStatus === CommandStatus.INVALID_COMMAND_SYNTAX) {
            msg += "\nCette commande ne respecte pas la syntaxe. Voir !aide";
        } else if (command.commandStatus === CommandStatus.UNDEFINED_COMMAND) {
            msg += "\nCette commande n'existe pas.";
        }

        this.sio.emit('command sent', player.name + " ~ " + msg);
    }
}
