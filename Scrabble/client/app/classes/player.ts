/**
 * player.ts - describes a player
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/04/02
 */

export class Player {
    private name: string;
    private nameValid: boolean;
    private roomID: number;

    constructor() {
        this.name = "";
        this.nameValid = false;
        this.roomID = -1;
    }

    public getName(): string {
        return this.name;
    }

    public getNameValid(): boolean {
        return this.nameValid;
    }

    public getRoomID(): number {
        return this.roomID;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public setNameValid(nameValid: boolean): void {
        this.nameValid = nameValid;
    }

    public setRoomID(roomID: number): void {
        this.roomID = roomID;
    }
}
