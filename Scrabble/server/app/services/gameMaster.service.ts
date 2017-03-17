/**
 * gameMaster.service.ts
 *
 * @authors Vincent Chassé, Félix Boulet
 * @date 2017/02/17
 */

import { Command, CommandType } from '../classes/command';
import { CommandPlaceWord } from '../classes/commandPlaceLetter';
import { CommandChangeLetter } from '../classes/commandChangeLetter';
import { Player } from './playerManager.service';

export enum CommandExecutionStatus {
    SUCCESS,
    ERROR // command cannot be executed
}

export class GameMaster {
    // games: Array<ScrabbleGame>;



    handleCommand(command: Command, player: Player): CommandExecutionStatus {
        switch (command.getCommandType()) {
            case CommandType.PLACER :
                return this.placeWord(command as CommandPlaceWord, player);
            case CommandType.CHANGER :
                return this.changeLetter(command as CommandChangeLetter, player);
            case CommandType.PASSER :
                return this.skipTurn(player);
            default :
                return CommandExecutionStatus.ERROR;
        }
    }

    private placeWord(command: CommandPlaceWord, player: Player): CommandExecutionStatus {
        // TODO : À implémenter le placement des lettres

        return CommandExecutionStatus.ERROR;
    }

    private changeLetter(command: CommandChangeLetter, player: Player): CommandExecutionStatus {
        // TODO : À implémenter le changement des lettres
        return CommandExecutionStatus.ERROR;
    }

    private skipTurn(player: Player): CommandExecutionStatus {
        // TODO : À implémenter le skip de tour
        return CommandExecutionStatus.ERROR;
    }
}
