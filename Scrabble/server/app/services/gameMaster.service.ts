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
import { LetterStash } from './letterStash.service';
import { StopwatchService } from './stopwatch.service';

export enum CommandExecutionStatus {
    SUCCESS,
    ERROR, // Command cannot be executed
    WAIT // A player is trying to play when it's not his turn
}

export class GameMaster {
    private scrabbleGame: ScrabbleGame;
    private players: Player[];
    private activePlayer: Player;
    private stash: LetterStash;
    private gameStarted: boolean;
    private stopwatch: StopwatchService;

    private readonly BINGO_BONUS = 50;
    private readonly RANDOMIZE_SWAP_COUNT = 20;

    constructor(players: Player[]) {
        this.scrabbleGame = new ScrabbleGame();
        this.players = players;
        this.stash = new LetterStash();
        this.gameStarted = false;
        this.stopwatch = new StopwatchService();
    }

    public getScrabbleGame(): ScrabbleGame {
        return this.scrabbleGame;
    }

    public getPlayers(): Player[] {
        return this.players;
    }

    public getActivePlayer(): Player {
        return this.activePlayer;
    }

    public isGameStarted(): boolean {
        return this.gameStarted;
    }

    public startGame(): void {
        if (!this.gameStarted) {
            // Order of players
            this.randomizePlayersOrder();

            // Active player
            this.activePlayer = this.players[0];

            // Give seven letters to each player from stash
            // TODO : Randomize letters and pick from stash
            for (let player of this.players) {
                player.addLetters(this.stash.pickLetters(7));
                console.log(player.getLettersRack());
            }

            // Start the timer
            this.stopwatch.start();
            this.checkTurnOver();

            this.gameStarted = true;
        }
    }

    private randomizePlayersOrder(): void {
        for (let i = 0; i < this.RANDOMIZE_SWAP_COUNT; i++) {
            let playerIndex1 = Math.floor(Math.random() * (this.players.length));
            let playerIndex2 = Math.floor(Math.random() * (this.players.length));
            this.swapPlayer(playerIndex1, playerIndex2);
        }
    }

    public swapPlayer(playerIndex1: number, playerIndex2: number): void {
        let temporaryPlayer: Player;

        temporaryPlayer = this.players[playerIndex1];
        this.players[playerIndex1] = this.players[playerIndex2];
        this.players[playerIndex2] = temporaryPlayer;
    }

    public handleCommand(command: Command, player: Player): CommandExecutionStatus {
        // The command !aide is always successful
        if (command.getCommandType() === CommandType.AIDE) {
            return CommandExecutionStatus.SUCCESS;
        }

        if (player.getSocketId() === this.activePlayer.getSocketId()) {
            switch (command.getCommandType()) {
                case CommandType.PLACER:
                    return this.placeWord(command as CommandPlaceWord);
                case CommandType.CHANGER:
                    return this.changeLetter(command as CommandChangeLetter);
                case CommandType.PASSER:
                    return this.endTurn();
                default:
                    return CommandExecutionStatus.ERROR;
            }
        }
        else {
            return CommandExecutionStatus.WAIT;
        }
    }

    private placeWord(command: CommandPlaceWord): CommandExecutionStatus {
        // 1- Validation du placement du mot
        if (this.canPlaceWord(command)) {

            let lettersToRemove = this.scrabbleGame.findLettersToRemove(command);
            // 2- Vérifier s'il est possible d'enlever les lettres manquantes du plateau de jeu du rack du joueur
            if (this.activePlayer.removeLetters(lettersToRemove)) {

                // 3- Placer les lettres sur le plateau de jeu
                this.scrabbleGame.placeWord(command);

                // 4- Appeler countWordPoint du ScrabbleGame pour compter les points du mot
                //    REGARDER SI LES LETTRES PLACÉS FORME UN AUTRE MOT ET COMPTER CES POINTS AUSSI
                let score = this.scrabbleGame.countWordPoint(command);

                // Si le player réussit un "Bingo", on ajout un bonus de 50 points
                if (this.activePlayer.isRackEmpty() === true) {
                    score += this.BINGO_BONUS;
                }

                // 5- Update le score du player
                this.activePlayer.addPoints(score);
                console.log("Point pour " + this.activePlayer.getName() + " : " + this.activePlayer.getPoints());

                // 6- Redonner au joueur des lettres
                // TODO : Prendre les lettres du stash
                this.activePlayer.addLetters(this.stash.pickLetters(lettersToRemove.length));

                // 7- Passer au prochain joueur
                this.endTurn();

                return CommandExecutionStatus.SUCCESS;
            }
        }

        return CommandExecutionStatus.ERROR;
    }

    private changeLetter(command: CommandChangeLetter): CommandExecutionStatus {
        const lettersToExchange = command.getLetters().split('');

        // Verify that there are enough letters left in the stash
        if (this.stash.getAmountLeft() >= lettersToExchange.length) {

            // Verifiy that the player has the letters he/she wants to exchange (refer to removeLetters())
            if (this.activePlayer.removeLetters(lettersToExchange)) {
                let exchangedLetters = this.stash.exchangeLetters(lettersToExchange);
                this.activePlayer.addLetters(exchangedLetters);
                this.endTurn();
                return CommandExecutionStatus.SUCCESS;
            }
        }
        return CommandExecutionStatus.ERROR;
    }

    private checkTurnOver() {
        setInterval(() => {
            if (this.stopwatch.isTurnOver()) {
                this.endTurn();
            }
        }, 1000);
    }

    private endTurn(): CommandExecutionStatus {
        let playerIndex = this.players.findIndex(p => p.getSocketId() === this.activePlayer.getSocketId());
        this.activePlayer = this.players[(playerIndex + 1) % this.players.length];

        // Reset the timer
        this.stopwatch.restart();

        return CommandExecutionStatus.SUCCESS;
    }

    private canPlaceWord(command: CommandPlaceWord): boolean {
        // 1- Verify if word can be physically placed on the board
        if (!this.scrabbleGame.isWordInBounds(command)) {
            return false;
        }

        // 2- Verify if word is correctly overlapping other words on the board
        if (!this.scrabbleGame.isWordCorrectlyOverlapping(command)) {
            return false;
        }

        // 3- Verify if the newly formed words are valid
        if (!this.scrabbleGame.areAllWordsValid(command)) {
            return false;
        }

        return true;
    }
}
