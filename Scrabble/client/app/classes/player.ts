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
    private roomCapacity: number;
    private score: number;
    private rackLettersCount: number;

    constructor() {
        this.name = "";
        this.nameValid = false;
        this.roomID = -1;
        this.roomCapacity = 0;
        this.score = 0;
        this.rackLettersCount = 0;
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

    public getRoomCapacity(): number {
        return this.roomCapacity;
    }

    public getScore(): number {
        return this.score;
    }

    public getRackLettersCount(): number {
        return this.rackLettersCount;
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

    public setRoomCapacity(roomCapacity: number): void {
        this.roomCapacity = roomCapacity;
    }

    public setScore(score: number): void {
        this.score = score;
    }

    public setRackLettersCount(rackLettersCount: number): void {
        this.rackLettersCount = rackLettersCount;
    }
}
