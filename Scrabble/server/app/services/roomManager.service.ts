/**
 * roomManager.service.ts
 *
 * @authors Mikael Ferland, Pierre To
 * @date 2017/02/19
 */

import { Room } from '../classes/room';
import * as io from 'socket.io-client';

export class RoomManager {

    private existingRooms : Array<Room>;
    private currentRoomID : number;
    socket: any;

    constructor() {
        this.existingRooms = new Array<Room>();
        this.currentRoomID = 0;

        this.socket = io.connect('http://localhost:3000');

        this.socket.on('wsFindRoom', (player: any) => {
            let room = this.joinRoom(player);
            this.socket.emit('swFindRoom', room.getRoomInfo(), player.name);
        });

        this.socket.on('wsRefreshRoomInfo', (roomID: number) => {
            let room = this.existingRooms.find(r => (r.getRoomInfo().roomID === roomID));

            if (room !== undefined) {
                this.socket.emit('swRefreshRoomInfo', room.getRoomInfo());
            }
        });

        this.socket.on('wsLeaveRoom', (roomID: number, playerName: string) => {
            let room = this.existingRooms.find(r => (r.getRoomInfo().roomID === roomID));

            if (room !== undefined) {
                room.removePlayer(playerName);

                if (room.isEmpty()) {
                    let index = this.existingRooms.indexOf(room);
                    this.existingRooms.splice(index, 1);
                }
            }
        });
    }

    getExistingRooms() : Array<Room> {
        return this.existingRooms;
    }

    joinRoom(player: any) : Room {
        let room = this.findRoom(player.capacity);

        if (room === undefined) {
            room = this.addRoom(player.capacity);
        }

        room.addPlayer(player.name);

        return room;
    }

    findRoom(roomCapacity : number) : Room {
        return this.existingRooms.find(r => (!r.isFull() && r.getRoomInfo().capacity === roomCapacity));
    }

    addRoom(roomCapacity : number) : Room {
        let newRoom = new Room(this.currentRoomID++, roomCapacity);
        this.existingRooms.push(newRoom);
        return newRoom;
    }
}
