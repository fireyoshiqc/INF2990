/**
 * socketManager.service.ts
 *
 * @authors Félix Boulet
 * @date 2017/02/19
 */

import { Room } from '../classes/room';
import * as io from 'socket.io';
import * as http from 'http';

export class SocketManager {
    sio: SocketIO.Server;
    constructor(server: http.Server) {
        this.sio = io.listen(server);
    }
    handleSockets() {
        this.sio.on('connection', (socket) => {


            console.log("User connected");
            this.sio.emit('user connect', socket.id + "~ User has connected to chat.");

            socket.on('chat message', (msg: string) => {
                this.sio.emit('message sent', socket.id + " ~ " + msg);
                console.log(msg);
            });

            socket.on('disconnect', (msg: any) => {
                this.sio.emit('user disconnect', socket.id + "~ User has disconnected from chat.");
                console.log("User disconnected");
            });

            socket.on('cwValidateName', (name: string) => {
                this.sio.emit('wsValidateName', name, socket.id);
            });

            socket.on('swNameValidated', (validity: boolean, id: any) => {
                this.sio.to(id).emit('wcNameValidated', validity);
            });

            socket.on('cwAddPlayer', (player: any) => {
                // Find (or create) a room in room manager service
                this.sio.emit('wsFindRoom', player);
            });

            // Room was found/created, send the information to the client
            socket.on('swFindRoom', (roomInfo: any, playerName: string) => {
                // Timeout of 500 ms is used to let the client load the waiting room page
                setTimeout(() => {
                    this.sio.emit('wcFindRoom', roomInfo, playerName);
                }, 500);
            });

            // Allows client to join a specific room
            socket.on('cwJoinRoom', (roomID: number, playerName: string) => {
                //TODO: C'EST TEMPORAIRE, ON DOIT RETRAVAILLER DANS LE PROCHAIN SPRINT
                this.sio.emit('wsAddPlayer', roomID, playerName, socket.id);
                socket.join(roomID.toString());
            });

            // Allows client to refresh the information of a specific room
            socket.on('cwRefreshRoomInfo', (roomID: number) => {
                this.sio.emit('wsRefreshRoomInfo', roomID);
            });

            socket.on('swRefreshRoomInfo', (roomInfo: any) => {
                this.sio.sockets.in(roomInfo.roomID.toString()).emit('wcRefreshRoomInfo', roomInfo);
            });

            // Allows client to leave a specific room
            socket.on('cwLeaveRoom', (player: any) => {
                socket.leave(player.roomID.toString());
                this.sio.emit('wsLeaveRoom', player);
            });

            socket.on('swRefresh', (existingRooms: any) => {
                for (let room of existingRooms) {
                    let id = room.roomInfo.roomID as number;
                    this.sio.sockets.in(id.toString()).emit('wcRefresh', room.roomInfo);
                }
            });
        });

    }
}
