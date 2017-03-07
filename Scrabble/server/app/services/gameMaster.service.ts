/**
 * gameMaster.service.ts
 *
 * @authors Vincent Chassé, Félix Boulet
 * @date 2017/02/17
 */

import * as io from 'socket.io-client';

export enum CommandExecutionStatus {
    SUCCESS,
    ERROR // command cannot be executed
}

export class GameMaster {
    socket: any;
    games: Array<ScrabbleGame>;

    constructor() {
        this.socket = io.connect('http://localhost:3000');
    }
}

class ScrabbleGame {
    // TODO: Fill when we have actual gameplay
}
