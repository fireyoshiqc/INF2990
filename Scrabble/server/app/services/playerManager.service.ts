/**
 * playerManager.service.ts
 *
 * @authors Vincent Chassé, Yawen Hou
 * @date 2017/02/17
 */

export class PlayerManager {

    players: Player[];

    constructor() {
        this.players = [];
    }

    validateName(name: string): boolean {

        let validity = this.players.find(p => (p.name === name)) === undefined;
        validity = validity && name.length > 3 && name.charAt(0) !== " " && name.charAt(name.length - 1) !== " ";
        console.log("The name " + name + " is" + (validity ? "" : " not") + " valid");
        return validity;
    }

    addPlayer(player: Player) {
        console.log("Name added : " + player.name);
        this.players.push(player);
    }

    removePlayer(name: string) {
        console.log("Removing player: " + name);
        let player = this.players.find(p => (p.name === name));
        if (player !== undefined) {
            this.players.splice(this.players.indexOf(player));
        }
    }

    getSocketName(socketId: string): Player {
        return this.players.find(p => (p.socketId === socketId));
    }
}

interface Player {
    roomId: number;
    name: string;
    socketId: string;
}
