/**
 * gameMaster.service.ts
 *
 * @authors Vincent Chassé, Félix Boulet
 * @date 2017/02/17
 */

import { Command, CommandType } from '../classes/command';

export enum CommandExecutionStatus {
    SUCCESS,
    ERROR // command cannot be executed
}

export class GameMaster {
    private games: Array<ScrabbleGame>;

    // handleCommand(cmd: Command): CommandExecutionStatus {
    //     switch (cmd.commandType) {
    //         case CommandType.PLACER :
    //             this.placeLetter(cmd.msg);
    //             return CommandExecutionStatus.SUCCESS;
    //             break;
    //         case CommandType.CHANGER :
    //             break;
    //         case CommandType.PASSER :
    //             break;
    //         default :
    //             return CommandExecutionStatus.ERROR;
    //     }
    // }

    // placeLetter(cmd: string) {

    // }
}

class ScrabbleGame {
    // TODO: Fill when we have actual gameplay
}
