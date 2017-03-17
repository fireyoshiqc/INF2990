/**
 * gameMaster.service.ts
 *
 * @authors Vincent Chassé, Félix Boulet
 * @date 2017/02/17
 */

import { Command, CommandType } from '../classes/command';
import { CommandPlaceWord } from '../classes/commandPlaceWord';
import { CommandChangeLetter } from '../classes/commandChangeLetter';
import { Player } from '../classes/player';
import { ScrabbleGame } from '../classes/scrabbleGame';

export enum CommandExecutionStatus {
    SUCCESS,
    ERROR // command cannot be executed
}

export class GameMaster {
    private scrabbleGame: ScrabbleGame;
    private players: Player[];
    //private activePlayer: Player;
    private readonly BINGO_BONUS = 50;

    constructor(players: Player[]) {
        this.scrabbleGame = new ScrabbleGame();
        this.players = players;

        //TODO: activePlayer
    }

    getScrabbleGame(): ScrabbleGame {
        return this.scrabbleGame;
    }

    getPlayers(): Player[] {
        return this.players;
    }

    handleCommand(command: Command, player: Player): CommandExecutionStatus {
        switch (command.getCommandType()) {
            case CommandType.PLACER:
                return this.placeWord(command as CommandPlaceWord, player);
            case CommandType.CHANGER:
                return this.changeLetter(command as CommandChangeLetter, player);
            case CommandType.PASSER:
                return this.skipTurn(player);
            default:
                return CommandExecutionStatus.ERROR;
        }
    }

    private placeWord(command: CommandPlaceWord, player: Player): CommandExecutionStatus {
        // TODO : À implémenter le placement des lettres
        // 1- Validation du placement du mot
        // 2- Placer les lettres avec (putLetter de boardTile) & enlever le lettres du rack de joueur
        //    REGARDER SI LES LETTRES PLACÉS FORME UN AUTRE MOT.
        // 3- Appeler countWordPoint du ScrabbleGame pour compter les points du mot
        let score = this.scrabbleGame.countWordPoint(command);
        // Si le player réussit un "Bingo", on ajout un bonus de 50 points
        if (player.isRackEmpty() === true) {
            score += this.BINGO_BONUS;
        }
        // 4- Update le score du player
        player.addPoints(score);
        // 5- Redonner au joueur des lettres

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
