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

// TODO: Rework this to be included in the appropriate commands.
export enum CommandExecutionStatus {
    SUCCESS, // Command executed successfully
    ERROR, // Command cannot be executed
    WAIT, // A player is trying to play when it's not his turn
    BLOCK, // A player is blocked during 3s when newly formed words are invalid

    // Execution status related to place word command
    SUCCESS_PLACE_WORD_CAN_PLACE_WORD,
    ERROR_PLACE_WORD_OUT_OF_BOUNDS,
    ERROR_PLACE_WORD_INCORRECT_OVERLAPPING,
    ERROR_PLACE_WORD_CENTRAL_TILE,
    ERROR_PLACE_WORD_ADJACENT_TILE,
    ERROR_PLACE_WORD_INVALID_WORDS,

    // Execution status related to change letter command
    SUCCESS_CHANGE_LETTER_STASH_ENOUGH,
    ERROR_CHANGE_LETTER_STASH_EMPTY,

    // Execution status related to remove letters from player's rack
    SUCCESS_REMOVE_LETTERS,
    ERROR_REMOVE_LETTERS
}

export interface ITurnInfo {
    minutes?: number;
    seconds?: number;
    activePlayerName?: string;
    players?: IPlayerInfo[];
    nLettersStash?: number;
    gameOver?: boolean;
}

export interface IPlayerInfo {
    name?: string;
    score?: number;
    nRackLetters?: number;
}

export class GameMaster {
    private scrabbleGame: ScrabbleGame;
    private players: Player[];
    private activePlayer: Player;
    private stash: LetterStash;
    private gameStarted: boolean;
    private stopwatch: StopwatchService;
    private turnInfo: ITurnInfo;
    private isFirstTurn: boolean;
    private nextTurn: boolean;
    private gameOver: boolean;

    private readonly BINGO_BONUS = 50;
    private readonly RANDOMIZE_SWAP_COUNT = 4;

    constructor(players: Player[]) {
        this.scrabbleGame = new ScrabbleGame();
        this.players = players;
        this.stash = new LetterStash();
        this.gameStarted = false;
        this.stopwatch = new StopwatchService();
        this.turnInfo = {};
        this.turnInfo.minutes = 0;
        this.turnInfo.seconds = 0;
        this.turnInfo.activePlayerName = "";
        this.turnInfo.players = [{}];
        this.turnInfo.nLettersStash = 0;
        this.isFirstTurn = true;
        this.gameOver = false;
    }

    public getScrabbleGame(): ScrabbleGame {
        return this.scrabbleGame;
    }

    public getPlayers(): Player[] {
        return this.players;
    }

    public getStash(): LetterStash {
        return this.stash;
    }

    public getActivePlayer(): Player {
        return this.activePlayer;
    }

    public isGameStarted(): boolean {
        return this.gameStarted;
    }

    public getTurnInfo(): ITurnInfo {
        this.updateTurnInfo();
        return this.turnInfo;
    }

    private updateTurnInfo(): void {
        // Clean the list in the case that players have left
        this.turnInfo.players = [];

        // Update information
        for (let i = 0; i < this.players.length; i++) {
            this.turnInfo.players[i] = {
                name: this.players[i].getName(),
                score: this.players[i].getPoints(),
                nRackLetters: this.players[i].getLettersRack().length
            };
        }

        this.turnInfo.nLettersStash = this.stash.getAmountLeft();
        this.turnInfo.gameOver = this.gameOver;
    }

    public getIsFirstTurn(): boolean {
        return this.isFirstTurn;
    }

    public blockActivePlayer(): void {
        this.activePlayer.setBlocked(true);
    }

    public resetNextTurn(): void {
        this.nextTurn = false;
    }

    public isNextTurn(): boolean {
        return this.nextTurn;
    }

    public setGameStarted(gameStarted: boolean): void {
        this.gameStarted = gameStarted;
    }

    public startGame(): void {
        if (!this.gameStarted) {
            // Order of players
            this.randomizePlayersOrder();

            // Active player
            this.activePlayer = this.players[0];
            this.turnInfo.activePlayerName = this.players[0].getName();

            // Give seven letters to each player from stash
            for (let player of this.players) {
                player.addLetters(this.stash.pickLetters(7));
            }

            // Start the timer
            this.stopwatch.start();
            this.turnInfo.minutes = this.stopwatch.getMinutesLeft();
            this.turnInfo.seconds = this.stopwatch.getSecondsLeft();
            this.checkTurnOver();

            this.nextTurn = false;
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

    private swapPlayer(playerIndex1: number, playerIndex2: number): void {
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
            if (this.activePlayer.getIsBlocked()) {
                return CommandExecutionStatus.BLOCK;
            }

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
        // 1- Validate if the word can be placed on the board
        let commandExecutionStatus = this.canPlaceWord(command);

        if (commandExecutionStatus === CommandExecutionStatus.SUCCESS_PLACE_WORD_CAN_PLACE_WORD) {

            // 2- Verify if the player possesses the letters
            let lettersToRemove = this.scrabbleGame.findLettersToRemove(command);
            commandExecutionStatus = this.activePlayer.removeLetters(lettersToRemove);

            if (commandExecutionStatus === CommandExecutionStatus.SUCCESS_REMOVE_LETTERS) {

                // 3- Place the letters on the board
                this.scrabbleGame.placeWord(command);

                // 4- Verify if the newly formed words are valid
                if (!this.scrabbleGame.areAllWordsValid()) {
                    return CommandExecutionStatus.ERROR_PLACE_WORD_INVALID_WORDS;
                } else {
                    // 5- Update player score
                    this.updatePlayerScore();

                    // 6- Pick new letters from stash
                    this.activePlayer.addLetters(this.stash.pickLetters(lettersToRemove.length));

                    // 7- End turn
                    this.endTurn();

                    // First turn requires different validation (central tile)
                    if (this.isFirstTurn) {
                        this.isFirstTurn = false;
                    }

                    return CommandExecutionStatus.SUCCESS;
                }
            }
        }

        return commandExecutionStatus;
    }

    private canPlaceWord(command: CommandPlaceWord): CommandExecutionStatus {
        // 1- Verify if word can be physically placed on the board
        if (!this.scrabbleGame.isWordInBounds(command)) {
            return CommandExecutionStatus.ERROR_PLACE_WORD_OUT_OF_BOUNDS;
        }

        // 2- Verify if word is correctly overlapping other words on the board
        if (!this.scrabbleGame.isWordCorrectlyOverlapping(command)) {
            return CommandExecutionStatus.ERROR_PLACE_WORD_INCORRECT_OVERLAPPING;
        }

        // 3a- During first turn, verify if a letter in the word is on the central tile H8
        if (this.isFirstTurn && !this.scrabbleGame.isWordOverlappingCentralTile(command)) {
            return CommandExecutionStatus.ERROR_PLACE_WORD_CENTRAL_TILE;
        } else if (!this.isFirstTurn && !this.scrabbleGame.isWordAdjacentToAnother(command)) {
            // 3b- Verify if a letter in the word is adjacent to another letter on the board
            return CommandExecutionStatus.ERROR_PLACE_WORD_ADJACENT_TILE;
        }

        return CommandExecutionStatus.SUCCESS_PLACE_WORD_CAN_PLACE_WORD;
    }

    private updatePlayerScore(): void {
        let score = this.scrabbleGame.countAllNewWordsPoint();

        // Add a 50 points bonus if the player has a "BINGO"
        if (this.activePlayer.isRackEmpty()) {
            score += this.BINGO_BONUS;
        }

        this.activePlayer.addPoints(score);

        // Bonus are valid only once
        this.scrabbleGame.deactivateUsedTilesBonus();
    }

    public undoPlaceWord(command: CommandPlaceWord, player: Player): string {
        this.activePlayer.setBlocked(false);
        this.endTurn();
        return this.scrabbleGame.removeWord(command, player);
    }

    private changeLetter(command: CommandChangeLetter): CommandExecutionStatus {
        const lettersToExchange = command.getLetters().split('');

        // Verify that there are enough letters left in the stash
        let commandExecutionStatus = (this.stash.getAmountLeft() >= lettersToExchange.length) ?
            CommandExecutionStatus.SUCCESS_CHANGE_LETTER_STASH_ENOUGH :
            CommandExecutionStatus.ERROR_CHANGE_LETTER_STASH_EMPTY;

        if (commandExecutionStatus === CommandExecutionStatus.SUCCESS_CHANGE_LETTER_STASH_ENOUGH) {

            // Verify that the player has the letters he/she wants to exchange (refer to removeLetters())
            commandExecutionStatus = this.activePlayer.removeLetters(lettersToExchange);

            if (commandExecutionStatus === CommandExecutionStatus.SUCCESS_REMOVE_LETTERS) {
                let exchangedLetters = this.stash.exchangeLetters(lettersToExchange);
                this.activePlayer.addLetters(exchangedLetters);
                this.endTurn();
                return CommandExecutionStatus.SUCCESS;
            }
        }

        return commandExecutionStatus;
    }

    private checkTurnOver(): void {
        setInterval(() => {
            if (this.stopwatch.isTurnOver()) {
                this.nextTurn = true;
            }

            // Update turnInfo
            this.turnInfo.minutes = this.stopwatch.getMinutesLeft();
            this.turnInfo.seconds = this.stopwatch.getSecondsLeft();

        }, 1000);
    }

    private endTurn(): CommandExecutionStatus {
        // Check if game is overlapping
        if (this.activePlayer.getLettersRack().length < this.activePlayer.getMaxRackSize()) {
            this.gameOver = true;
            this.adjustFinalScores();
            // TODO: Deduct points for letters left (different funct)
            return null;
        }

        // Update active player
        let playerIndex = this.players.findIndex(p => p.getSocketId() === this.activePlayer.getSocketId());
        this.activePlayer = this.players[(playerIndex + 1) % this.players.length];

        // Reset the timer
        this.stopwatch.restart();

        if (this.activePlayer !== undefined) {
            this.turnInfo.activePlayerName = this.activePlayer.getName();
        }

        return CommandExecutionStatus.SUCCESS;
    }

    public isGameOver(): boolean {
        return this.gameOver;
    }

    private adjustFinalScores(): void {
        let scoreBonus = 0;

        this.players.forEach(player => {
            if (player !== this.activePlayer) {
                player.subtractPoints(player.getTotalRackPoints());
                scoreBonus += player.getTotalRackPoints();
            }
        });

        this.activePlayer.addPoints(scoreBonus);
    }

    public handleQuit(playerName: string): void {
        if (this.gameStarted) {
            // Skip to the next player only if the player who is trying to quit the game is the active player
            if (this.activePlayer.getName() === playerName) {
                this.endTurn();
            }

            // Return player's letters to the stash
            let indexPlayers = this.players.findIndex(p => p.getName() === playerName);
            let lettersToReturn = this.players[indexPlayers].getLettersRack();
            this.stash.returnLetters(lettersToReturn);
        }
    }
}
