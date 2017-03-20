/**
 * room.service.ts
 *
 * @authors Mikael Ferland, Pierre To
 * @date 2017/02/19
 */

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SocketHandler } from './../modules/socketHandler.module';

export interface IRoomInfo {
    roomID: number;
    capacity: number;
    playerList: string[];
}

@Injectable()
export class RoomService {

    private readonly HOST_NAME = "http://" + window.location.hostname;
    private readonly SERVER_PORT = ":3000";
    private socket: SocketIOClient.Socket;
    private roomInfo = { roomID: -1, capacity: 0, playerList: new Array<string>() };
    private roomJoined = false; // Prevents wcFindRoom from being called multiple times
    private playerName: string;
    private missingPlayers = -1;

    constructor(private http: Http) {
        this.socket = SocketHandler.requestSocket(this.HOST_NAME + this.SERVER_PORT);

        this.socket.on('wcFindRoom', (roomInfo: any, playerName: string) => {
            if (!this.roomJoined) {
                // Set the information of the room
                this.roomInfo = roomInfo;
                this.playerName = playerName;
                this.roomJoined = true;
            }
        });

        this.socket.on("wcRefresh", (roomInfo: any) => {
            this.roomInfo = roomInfo;

        });
    }

    startGame(roomID: number): void {
        this.socket.emit('cwStartGame', roomID);
    }

    leaveRoom(): void {
        this.socket.emit('cwLeaveRoom', { roomID: this.roomInfo.roomID, name: this.playerName });

        // Reset all room info
        this.roomJoined = false;
        this.playerName = "";
        this.missingPlayers = -1;
        this.roomInfo = { roomID: -1, capacity: 0, playerList: new Array<string>() };
    }

    getRoomInfo(): IRoomInfo {
        return this.roomInfo;
    }

    getPlayerName(): string {
        return this.playerName;
    }

    getMissingPlayers(): number {
        return this.roomInfo.capacity > 0 ? this.roomInfo.capacity - this.roomInfo.playerList.length : -1;
    }

}
