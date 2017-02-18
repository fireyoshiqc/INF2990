import { Room } from '../classes/room';
import * as io from 'socket.io';

export class RoomManager {

    private existingRooms : Array<Room>;
    private currentRoomID : number;

    constructor() {
        this.existingRooms = new Array<Room>();
        this.currentRoomID = 0;
    }

    getExistingRooms() : Array<Room> {
        return this.existingRooms;
    }

    findRoom(roomCapacity : number) : Room {
        return this.existingRooms.find(r => (!r.isFull() && r.getIsWaiting() && r.getCapacity() === roomCapacity));
    }

    addRoom(roomCapacity : number) : Room {
        let newRoom = new Room(this.currentRoomID++, roomCapacity);
        this.existingRooms.push(newRoom);
        return newRoom;
    }

    joinRoom(socket : SocketIO.Socket, roomCapacity : number) {
        let room = this.findRoom(roomCapacity);

        if (room === undefined) {
            room = this.addRoom(roomCapacity);
        }

        socket.join(room.getRoomID().toString());
        console.log("Room #" + room.getRoomID().toString() + " has been joined!");
    }
}
