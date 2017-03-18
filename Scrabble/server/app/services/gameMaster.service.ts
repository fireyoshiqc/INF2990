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
    ERROR, // command cannot be executed
    WAIT // a player is trying to play when it's not his turn
}

export class GameMaster {
    private scrabbleGame: ScrabbleGame;
    private players: Player[];
    private activePlayer: Player;
    private gameStarted: boolean;

    private readonly BINGO_BONUS = 50;
    private readonly RANDOMIZE_SWAP_COUNT = 20;

    constructor(players: Player[]) {
        this.scrabbleGame = new ScrabbleGame();
        this.players = players;
        this.gameStarted = false;
    }

    getScrabbleGame(): ScrabbleGame {
        return this.scrabbleGame;
    }

    getPlayers(): Player[] {
        return this.players;
    }

    getActivePlayer(): Player {
        return this.activePlayer;
    }

    isGameStarted(): boolean {
        return this.gameStarted;
    }

    startGame(): void {
        if (!this.gameStarted) {
            // Order of players
            this.randomizePlayersOrder();

            // Active player
            this.activePlayer = this.players[0];

            // Give seven letters to each player from stash

            this.gameStarted = true;
        }
    }

    randomizePlayersOrder(): void {
        for (let i = 0; i < this.RANDOMIZE_SWAP_COUNT; i++) {
            let playerIndex1 = Math.floor(Math.random() * (this.players.length));
            let playerIndex2 = Math.floor(Math.random() * (this.players.length));
            this.swapPlayer(playerIndex1, playerIndex2);
        }
    }

    swapPlayer(playerIndex1: number, playerIndex2: number): void {
        let temporaryPlayer: Player;

        temporaryPlayer = this.players[playerIndex1];
        this.players[playerIndex1] = this.players[playerIndex2];
        this.players[playerIndex2] = temporaryPlayer;
    }

    handleCommand(command: Command, player: Player): CommandExecutionStatus {
        if (player.getSocketId() === this.activePlayer.getSocketId()) {
            switch (command.getCommandType()) {
                case CommandType.PLACER:
                    return this.placeWord(command as CommandPlaceWord);
                case CommandType.CHANGER:
                    return this.changeLetter(command as CommandChangeLetter);
                case CommandType.PASSER:
                    return this.skipTurn();
                default:
                    return CommandExecutionStatus.ERROR;
            }
        }
        else {
            return CommandExecutionStatus.WAIT;
        }
    }

    private placeWord(command: CommandPlaceWord): CommandExecutionStatus {
        // TODO : À implémenter le placement des lettres

        // 1- Validation du placement du mot
        if (this.canPlaceWord(command)) {
            // 2- Placer les lettres avec (putLetter de boardTile) & enlever le lettres du rack de joueur
            let lettersToRemove = this.scrabbleGame.placeWord(command);
            this.activePlayer.removeLetters(lettersToRemove); 
            //TODO: SEND THE ARRAY OF STRING TO SOCKET MANAGER SO THAT THE CLIENT RECEIVES IT <===

            // 3- Appeler countWordPoint du ScrabbleGame pour compter les points du mot
            //    REGARDER SI LES LETTRES PLACÉS FORME UN AUTRE MOT ET COMPTER CES POINTS AUSSI
            let score = this.scrabbleGame.countWordPoint(command);
            // Si le player réussit un "Bingo", on ajout un bonus de 50 points
            if (this.activePlayer.isRackEmpty() === true) {
                score += this.BINGO_BONUS;
            }
            // 4- Update le score du player
            this.activePlayer.addPoints(score);
            // 5- Redonner au joueur des lettres

            // 6- Passer au prochain joueur
            this.skipTurn();

            return CommandExecutionStatus.SUCCESS;
        }

        return CommandExecutionStatus.ERROR;
    }

    private changeLetter(command: CommandChangeLetter): CommandExecutionStatus {
        // TODO : À implémenter le changement des lettres
        return CommandExecutionStatus.ERROR;
    }

    private skipTurn(): CommandExecutionStatus {
        let playerIndex = this.players.findIndex(p => p.getSocketId() === this.activePlayer.getSocketId());
        this.activePlayer = this.players[(playerIndex + 1) % this.players.length];
        return CommandExecutionStatus.SUCCESS;
    }

    private canPlaceWord(command: CommandPlaceWord): boolean {
        // 1- Verify if word exists

        // 2- Verify if word can be physically placed on the board
        if (!this.scrabbleGame.isWordInBounds(command)) {
            return false;
        }

        // 3- Verify if word is correctly overlapping other words on the board
        if (!this.scrabbleGame.isWordCorrectlyOverlapping(command)) {
            return false;
        }

        // 4- Verify if the newly formed words are valid
        // if (!this.scrabbleGame.areAllWordsValid(command)) {
        //     return false;
        // }

        return true;
    }
}
