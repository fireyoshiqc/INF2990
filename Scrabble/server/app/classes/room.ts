/**
 * room.ts - implements the room for a scrabble game
 *
 * @authors Mikael Ferland, Pierre To
 * @date 2017/02/18
 */

import { Player } from './Player';

export interface RoomInfo {
    roomID: number;
    capacity: number;
    playerList: string[];
}

export class Room {
    private roomInfo : RoomInfo = { roomID: -1, capacity: 0, playerList: new Array<string>() };
    private presentPlayers: Player[];

    constructor(roomID: number, capacity : number) {
        this.roomInfo.roomID = roomID;
        this.roomInfo.capacity = capacity;
        this.roomInfo.playerList = new Array<string>();
        this.presentPlayers = new Array<Player>();
    }

    getRoomInfo(): RoomInfo {
        return this.roomInfo;
    }

    addPlayer(playerName : string) {
        if (!this.isFull()) {
            this.roomInfo.playerList.push(playerName);
            // TODO: ADD PLAYER TO presentPlayers
        }
    }

    removePlayer(playerName : string) {
        if (this.roomInfo.playerList.length > 0) {
            let index = this.roomInfo.playerList.indexOf(playerName);
            this.roomInfo.playerList.splice(index, 1);
            // TODO: REMOVE PLAYER TO presentPlayers
        }
    }

    isFull() : boolean {
        return this.roomInfo.playerList.length >= this.roomInfo.capacity;
    }

    isEmpty() : boolean {
        return this.roomInfo.playerList.length === 0;
    }
}
