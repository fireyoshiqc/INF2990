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

    public getExistingRooms(): Array<Room> {
        return this.existingRooms;
    }

    public createRoom(roomCapacity: number): Room {
        let room = this.existingRooms.find(r => (!r.isFull() && !r.getGameMaster().isGameStarted()
                                            && r.getRoomInfo().capacity === roomCapacity));

        if (room === undefined) {
            room = this.addRoom(roomCapacity);
        }

        return room;
    }

    public addRoom(roomCapacity: number): Room {
        let newRoom = new Room(this.currentRoomID++, roomCapacity);
        this.existingRooms.push(newRoom);
        return newRoom;
    }

    public findRoom(roomID: number): Room {
        return this.existingRooms.find(r => r.getRoomInfo().roomID === roomID);
    }

    public leaveRoom(playerName: string, roomID: number) {
        let room = this.existingRooms.find(r => (r.getRoomInfo().roomID === roomID));

        if (room !== undefined) {
            room.removePlayer(playerName);

            if (room.isEmpty()) {
                let index = this.existingRooms.indexOf(room);
                this.existingRooms.splice(index, 1);
            }
        }
    }
}
