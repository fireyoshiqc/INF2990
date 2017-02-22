/**
 * socketManager.service.ts
 *
 * @authors Félix Boulet
 * @date 2017/02/19
 */

import * as io from 'socket.io';
import * as http from 'http';
import { RoomManager } from './roomManager.service';
import { PlayerManager } from './playerManager.service';

export class SocketManager {
    sio: SocketIO.Server;
    rmanager: RoomManager;
    pmanager: PlayerManager;
    constructor(server: http.Server) {
        this.sio = io.listen(server);
        this.rmanager = new RoomManager();
        this.pmanager = new PlayerManager();
    }
    handleSockets() {
        this.sio.on('connection', (socket) => {


            //TODO: Rework this whole thing.
            console.log("User connected");
            this.sio.emit('user connect', socket.id + "~ User has connected to chat.");

            socket.on('chat message', (msg: string) => {
                // let player = this.pmanager.getSocketName(socket);
                // if (player !== undefined) {
                //     this.sio.emit('message sent', player.name + " ~ " + msg);
                // }
                //TODO: Use same socket, not new chat socket.
                this.sio.emit('message sent', socket.id + " ~ " + msg);
                console.log(msg);
            });

            socket.on('disconnect', (msg: any) => {
                let player = this.pmanager.getSocketName(socket);
                if (player !== undefined) {
                    this.pmanager.removePlayer(player.name);
                    this.rmanager.leaveRoom(player);
                    this.sio.emit('user disconnect', player.name + "~ User has disconnected from chat.");
                }

                console.log("User disconnected");
            });
            //TODO: Rework the whole thing above.

            //IDEA: Check this out, we're gonna apply this model to everything first.
            socket.on('cwValidateName', (name: string) => {
                let validity = this.pmanager.validateName(name);
                socket.emit('wcNameValidated', validity);
                //this.sio.emit('wsValidateName', name, socket.id);
            });

            //TODO: Replace by player manager call.
            socket.on('cwAddPlayer', (player: any) => {
                // Find (or create) a room in room manager service
                let room = this.rmanager.joinRoom(player);
                setTimeout(() => {
                    this.sio.emit('wcFindRoom', room.getRoomInfo(), player.name);
                }, 500);
            });

            // Allows client to join a specific room
            //IDEA: We should handle players via individual sockets in another class.
            socket.on('cwJoinRoom', (roomID: number, playerName: string) => {
                //TODO: C'EST TEMPORAIRE, ON DOIT RETRAVAILLER DANS LE PROCHAIN SPRINT
                this.pmanager.addPlayer({ roomId: roomID, name: playerName, socketId: socket.id });
                //this.sio.emit('wsAddPlayer', roomID, playerName, socket.id);
                socket.join(roomID.toString());
            });

            // Allows client to leave a specific room
            //TODO: Replace by room manager call.
            socket.on('cwLeaveRoom', (player: any) => {
                this.rmanager.leaveRoom(player);
                this.pmanager.removePlayer(player.name);
                socket.leave(player.roomID.toString());

                //this.sio.emit('wsLeaveRoom', player);
            });

            setInterval(() => {
                for (let room of this.rmanager.getExistingRooms()) {
                    let id = room.getRoomInfo().roomID as number;
                    this.sio.sockets.in(id.toString()).emit('wcRefresh', room.getRoomInfo());
                }
            }, 1000);
        });

    }
}
