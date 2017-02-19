/**
 *
 * @authors Vincent Chassé, Yawen Hou
 * @date 2017/02/17
 */

import * as io from 'socket.io-client';

export class PlayerManager {

    socket: any;
    playerNames: string[];

    constructor() {
        this.socket = io.connect('http://localhost:3000');

        this.socket.on('wsValidateName', (name: string) => {
            this.socket.emit('swNameValidated', this.validateName(name));
        });

        this.socket.on('wsAddPlayer', (name: string) => {
            this.addPlayer(name);
        });

        this.playerNames = new Array<string>();
    }

    validateName(name: string): boolean {
        let validity = this.playerNames.indexOf(name) === -1;
        validity = validity && name.length > 3 && name.charAt(0) !== " " && name.charAt(name.length - 1) !== " ";
        console.log("The name " + name + " is" + (validity ? "" : " not") + " valid");
        return validity;
    }

    addPlayer(name: string) {
        console.log("Name added : " + name);
        this.playerNames.push(name);
    }

    removePlayer(name: string) {
        if (this.playerNames.indexOf(name) !== -1) {
            this.playerNames.splice(this.playerNames.indexOf(name));
        }
    }
}
