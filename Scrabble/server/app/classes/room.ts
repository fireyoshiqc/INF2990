/**
 * room.ts - implements the room for a scrabble game
 *
 * @authors Mikael Ferland, Pierre To
 * @date 2017/02/18
 */

export class Room {
    private roomID : number;
    private numberOfCurrentPlayers : number;
    private readonly capacity : number;
    private isWaiting : boolean;

    constructor(roomID: number, capacity : number) {
        this.roomID = roomID;
        this.numberOfCurrentPlayers = 0;
        this.capacity = capacity;
        this.isWaiting = true;
    }

    getRoomID(): number {
        return this.roomID;
    }

    getNumberOfCurrentPlayers(): number {
        return this.numberOfCurrentPlayers;
    }

    getCapacity(): number {
        return this.capacity;
    }

    getIsWaiting(): boolean {
        return this.isWaiting;
    }

    play() {
        this.isWaiting = false;
    }

    // Returns true if a player has been added.
    // Returns false if the room is already full.
    addPlayer() : boolean {
        if (!this.isFull()) {
            this.numberOfCurrentPlayers++;
            return true;
        }
        else {
            return false;
        }
    }

    // Returns true if a player has been removed.
    // Returns false if the room is empty.
    removePlayer() : boolean {
        if (this.numberOfCurrentPlayers > 0) {
            this.numberOfCurrentPlayers--;
            return true;
        }
        else {
            return false;
        }
    }

    isFull() : boolean {
        return this.numberOfCurrentPlayers === this.capacity;
    }
}
