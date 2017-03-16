/**
 * roomManager.service.ts
 *
 * @authors Mikael Ferland, Pierre To
 * @date 2017/02/19
 */

import { Room } from '../classes/room';

export class RoomManager {

    private existingRooms: Array<Room>;
    private currentRoomID: number;

    constructor() {
        this.existingRooms = new Array<Room>();
        this.currentRoomID = 0;
    }

    getExistingRooms(): Array<Room> {
        return this.existingRooms;
    }

    joinRoom(player: any): Room {
        let room = this.findRoom(player.capacity);

        if (room === undefined) {
            room = this.addRoom(player.capacity);
        }

        room.addPlayer(player.name);
        return room;
    }

    leaveRoom(player: any) {
        let room = this.existingRooms.find(r => (r.getRoomInfo().roomID === player.roomID));

        if (room !== undefined) {
            room.removePlayer(player.name);

            if (room.isEmpty()) {
                let index = this.existingRooms.indexOf(room);
                this.existingRooms.splice(index, 1);
            }
        }
    }

    findRoom(roomCapacity: number): Room {
        return this.existingRooms.find(r => (!r.isFull() && r.getRoomInfo().capacity === roomCapacity));
    }

    addRoom(roomCapacity: number): Room {
        let newRoom = new Room(this.currentRoomID++, roomCapacity);
        this.existingRooms.push(newRoom);
        return newRoom;
    }
}
