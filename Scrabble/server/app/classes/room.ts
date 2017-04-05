/**
 * room.ts - implements the room for a scrabble game
 *
 * @authors Mikael Ferland, Pierre To
 * @date 2017/02/18
 */

import { Player } from './player';
import { GameMaster } from '../services/gameMaster.service';

export interface IRoomInfo {
    roomID: number;
    capacity: number;
    playerList: string[];
}

export class Room {
    private roomInfo: IRoomInfo = { roomID: -1, capacity: 0, playerList: new Array<string>() };
    private players: Player[];
    private gameMaster: GameMaster;

    constructor(roomID: number, capacity: number) {
        this.roomInfo.roomID = roomID;
        this.roomInfo.capacity = capacity;
        this.roomInfo.playerList = new Array<string>();
        this.players = new Array<Player>();
        this.gameMaster = new GameMaster(this.players);
    }

    public getRoomInfo(): IRoomInfo {
        return this.roomInfo;
    }

    public getPlayers(): Player[] {
        return this.players;
    }

    public getGameMaster(): GameMaster {
        return this.gameMaster;
    }

    public addPlayer(player: Player): void {
        if (!this.isFull()) {
            console.log(player.getName() + " joined the room " + this.roomInfo.roomID);
            this.roomInfo.playerList.push(player.getName());
            this.players.push(player);
        }
    }

    public removePlayer(playerName: string): void {
        if (this.players.length > 0) {
            // Remove player from room info (contains only player names string)
            let indexPlayerList = this.roomInfo.playerList.indexOf(playerName);

            if (this.gameMaster.isGameOver()) {
                // Cross out player
                console.log("Cross out: " + playerName);
            } else {
                // Remove player from list completely
                this.roomInfo.playerList.splice(indexPlayerList, 1);
                
                this.gameMaster.handleQuit(playerName);

                // Remove player from room (contains Player object)
                let indexPlayers = this.players.findIndex(p => p.getName() === playerName);
                this.players.splice(indexPlayers, 1);
            }

            console.log(playerName + " quit the room " + this.roomInfo.roomID);
        }
    }

    public isFull(): boolean {
        return this.roomInfo.playerList.length >= this.roomInfo.capacity;
    }

    public isEmpty(): boolean {
        return this.roomInfo.playerList.length === 0;
    }

    public isAvailable(roomCapacity: number): boolean {
        return !this.isFull() && !this.gameMaster.isGameStarted()
            && this.roomInfo.capacity === roomCapacity;
    }
}
