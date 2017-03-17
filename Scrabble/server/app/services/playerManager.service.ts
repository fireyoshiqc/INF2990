/**
 * playerManager.service.ts
 *
 * @authors Vincent Chassé, Yawen Hou
 * @date 2017/02/17
 */

import { Player } from '../classes/player';

export class PlayerManager {

    players: Player[];

    constructor() {
        this.players = [];
    }

    validateName(name: string): boolean {
        let validity = this.players.find(p => (p.getName() === name)) === undefined;
        validity = validity && name.length > 3 && name.charAt(0) !== " " && name.charAt(name.length - 1) !== " ";
        console.log("The name " + name + " is" + (validity ? "" : " not") + " valid");
        return validity;
    }

    addPlayer(playerName: string, socketId: string, roomID: number): Player {
        console.log("Player added to the playerManager : " + playerName);
        let newPlayer = new Player(playerName, socketId, roomID);
        this.players.push(newPlayer);
        return newPlayer;
    }

    removePlayer(playerName: string): void {
        console.log("Removing player from playerManager : " + playerName);
        let player = this.players.find(p => (p.getName() === playerName));

        if (player !== undefined) {
            this.players.splice(this.players.indexOf(player), 1);
        }
    }

    getPlayerFromSocketID(socketId: string): Player {
        return this.players.find(p => (p.getSocketId() === socketId));
    }
}
