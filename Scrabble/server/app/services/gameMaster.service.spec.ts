/**
 * gameMaster.service.spec.ts
 *
 * @authors Mikael Ferland, Pierre To
 * @date 2017/03/11
 */

import { GameMaster, CommandExecutionStatus } from './gameMaster.service';
import { Player } from '../classes/player';
import { ScrabbleGame } from '../classes/scrabbleGame';
import { Command, CommandType, CommandStatus } from '../classes/command';
import { CommandPlaceWord } from '../classes/commandPlaceWord';
import { Letter } from '../classes/letter';
import { CommandChangeLetter } from '../classes/commandChangeLetter';
import { LetterStash } from './letterStash.service';

import { expect } from 'chai';

describe('GameMaster', () => {
    let players = [new Player("player1", "1", 1), new Player("player2", "2", 1)];
    let gameMaster = new GameMaster(players);

    describe('Default constructor', () => {
        it('should construct a GameMaster object.', done => {
            expect(gameMaster).to.exist;
            expect(gameMaster).to.be.an.instanceOf(GameMaster);
            expect(gameMaster.getScrabbleGame()).to.be.an.instanceOf(ScrabbleGame);
            expect(gameMaster.getPlayers()[0].getName()).to.be.equal("player1");
            expect(gameMaster.getPlayers()[1].getName()).to.be.equal("player2");
            expect(gameMaster.getStash()).to.be.an.instanceOf(LetterStash);
            expect(gameMaster.getActivePlayer()).to.be.undefined;
            expect(gameMaster.isGameStarted()).to.be.false;
            expect(gameMaster.getTurnInfo().minutes).to.be.equal(0);
            expect(gameMaster.getTurnInfo().seconds).to.be.equal(0);
            expect(gameMaster.getTurnInfo().activePlayerName).to.be.equal("");
            expect(gameMaster.getTurnInfo().nLettersStash).to.be.equal(102);
            expect(gameMaster.getIsFirstTurn()).to.be.true;
            done();
        });
    });

    describe('swapPlayers()', () => {
        it('should swap two players\' order.', done => {
            expect(gameMaster.getPlayers()[0].getName()).to.be.equal("player1");
            expect(gameMaster.getPlayers()[1].getName()).to.be.equal("player2");

            gameMaster.swapPlayer(0, 1);

            expect(gameMaster.getPlayers()[0].getName()).to.be.equal("player2");
            expect(gameMaster.getPlayers()[1].getName()).to.be.equal("player1");
            done();
        });
    });

    describe('startGame()', () => {
        it('should start the game.', done => {
            gameMaster.startGame();

            expect(gameMaster.isGameStarted()).to.be.true;
            expect(gameMaster.getTurnInfo().activePlayerName).to.be.equal(gameMaster.getActivePlayer().getName());
            expect(gameMaster.getPlayers()[0].getLettersRack().length).to.be.equal(7);
            expect(gameMaster.getPlayers()[1].getLettersRack().length).to.be.equal(7);
            done();
        });
    });

    describe('handleCommand()', () => {
        describe('helpCommand', () => {
            it('should return success since help is always successful.', done => {
                let firstPlayer = gameMaster.getPlayers()[0];
                let secondPlayer = gameMaster.getPlayers()[1];
                let helpCommand = new Command(CommandType.AIDE, CommandStatus.VALID_COMMAND);

                expect(gameMaster.handleCommand(helpCommand, firstPlayer)).to.be.equal(CommandExecutionStatus.SUCCESS);
                expect(gameMaster.handleCommand(helpCommand, secondPlayer)).to.be.equal(CommandExecutionStatus.SUCCESS);

                done();
            });
        });

        describe('placeLetter()', () => {
            it('should return out of bounds error', done => {
                let activePlayer = gameMaster.getActivePlayer();
                let letters = new Array<Letter>();
                letters.push(new Letter("B"));
                letters.push(new Letter("A"));
                letters.push(new Letter("L"));
                letters.push(new Letter("L"));
                letters.push(new Letter("O"));
                letters.push(new Letter("N"));
                letters.push(new Letter("S"));
                activePlayer.setLetters(letters);

                let c1 = new CommandPlaceWord("a", 14, "h", "ballons");

                expect(gameMaster.handleCommand(c1, activePlayer))
                    .to.be.equal(CommandExecutionStatus.ERROR_PLACE_WORD_OUT_OF_BOUNDS);

                done();
            });

            it('should return error when the first word is not overlapping the central tile', done => {
                let activePlayer = gameMaster.getActivePlayer();
                let letters = new Array<Letter>();
                letters.push(new Letter("C"));
                letters.push(new Letter("H"));
                letters.push(new Letter("A"));
                letters.push(new Letter("T"));
                letters.push(new Letter("O"));
                letters.push(new Letter("N"));
                letters.push(new Letter("S"));
                activePlayer.setLetters(letters);

                let c1 = new CommandPlaceWord("a", 1, "h", "chat");

                expect(gameMaster.getIsFirstTurn()).to.be.true;

                expect(gameMaster.handleCommand(c1, activePlayer))
                    .to.be.equal(CommandExecutionStatus.ERROR_PLACE_WORD_CENTRAL_TILE);

                let c2 = new CommandPlaceWord("h", 6, "h", "chat");

                expect(gameMaster.handleCommand(c2, activePlayer))
                    .to.be.equal(CommandExecutionStatus.SUCCESS);
                expect(gameMaster.getIsFirstTurn()).to.be.false;
                expect(activePlayer.getPoints()).to.be.equal(18);

                done();
            });

            it('should return error when the word is not overlapping correctly', done => {
                let activePlayer = gameMaster.getActivePlayer();
                let letters = new Array<Letter>();
                letters.push(new Letter("C"));
                letters.push(new Letter("H"));
                letters.push(new Letter("A"));
                letters.push(new Letter("T"));
                letters.push(new Letter("T"));
                letters.push(new Letter("E"));
                letters.push(new Letter("S"));
                activePlayer.setLetters(letters);

                let c1 = new CommandPlaceWord("h", 4, "h", "chattes");

                expect(gameMaster.handleCommand(c1, activePlayer))
                    .to.be.equal(CommandExecutionStatus.ERROR_PLACE_WORD_INCORRECT_OVERLAPPING);

                done();
            });

            it('should return error when the word is not adjacent to another', done => {
                let activePlayer = gameMaster.getActivePlayer();
                let letters = new Array<Letter>();
                letters.push(new Letter("E"));
                letters.push(new Letter("R"));
                letters.push(new Letter("R"));
                letters.push(new Letter("A"));
                letters.push(new Letter("I"));
                letters.push(new Letter("N"));
                letters.push(new Letter("S"));
                activePlayer.setLetters(letters);

                let c1 = new CommandPlaceWord("a", 1, "h", "terrains");

                expect(gameMaster.handleCommand(c1, activePlayer))
                    .to.be.equal(CommandExecutionStatus.ERROR_PLACE_WORD_ADJACENT_TILE);

                let c2 = new CommandPlaceWord("h", 9, "v", "terrains");

                expect(gameMaster.handleCommand(c2, activePlayer))
                    .to.be.equal(CommandExecutionStatus.SUCCESS);
                expect(activePlayer.getPoints()).to.be.equal(60);

                done();
            });

            it('should return error when the newly formed words are not valid', done => {
                let activePlayer = gameMaster.getActivePlayer();
                let letters = new Array<Letter>();
                letters.push(new Letter("C"));
                letters.push(new Letter("H"));
                letters.push(new Letter("A"));
                letters.push(new Letter("T"));
                letters.push(new Letter("T"));
                letters.push(new Letter("E"));
                letters.push(new Letter("S"));
                activePlayer.setLetters(letters);

                let c1 = new CommandPlaceWord("h", 10, "h", "chat");

                expect(gameMaster.handleCommand(c1, activePlayer))
                    .to.be.equal(CommandExecutionStatus.ERROR_PLACE_WORD_INVALID_WORDS);

                done();
            });

            it('should return the letters to the player rack', done => {
                expect(gameMaster.getScrabbleGame().getBoard()[7][9].getLetter().getCharacter()).to.be.equal("C");
                expect(gameMaster.getScrabbleGame().getBoard()[7][10].getLetter().getCharacter()).to.be.equal("H");
                expect(gameMaster.getScrabbleGame().getBoard()[7][11].getLetter().getCharacter()).to.be.equal("A");
                expect(gameMaster.getScrabbleGame().getBoard()[7][12].getLetter().getCharacter()).to.be.equal("T");

                let activePlayer = gameMaster.getActivePlayer();
                gameMaster.blockActivePlayer();

                let c1 = new CommandPlaceWord("h", 10, "h", "chat");

                gameMaster.undoPlaceWord(c1, activePlayer);

                expect(activePlayer.getIsBlocked()).to.be.false;
                expect(activePlayer.getLettersRack()).to.be.eql(["T", "E", "S", "C", "H", "A", "T"]);
                expect(gameMaster.getScrabbleGame().getBoard()[7][9].getLetter()).to.be.null;
                expect(gameMaster.getScrabbleGame().getBoard()[7][10].getLetter()).to.be.null;
                expect(gameMaster.getScrabbleGame().getBoard()[7][11].getLetter()).to.be.null;
                expect(gameMaster.getScrabbleGame().getBoard()[7][12].getLetter()).to.be.null;

                done();
            });
        });

        describe('changeLetter()', () => {
            it('should return success when player is changing a letter from his rack.', done => {
                let activePlayer = gameMaster.getActivePlayer();
                let activePlayerRack = activePlayer.getLettersRack();
                let letterToChange = activePlayerRack[0];
                let changeLetterCommand = new CommandChangeLetter(letterToChange);

                expect(gameMaster.handleCommand(changeLetterCommand, activePlayer))
                    .to.be.equal(CommandExecutionStatus.SUCCESS);

                let stash = gameMaster.getStash();
                let amountLeft = stash.getAmountLeft();
                stash.pickLetters(amountLeft);

                activePlayer = gameMaster.getActivePlayer();
                activePlayerRack = activePlayer.getLettersRack();
                letterToChange = activePlayerRack[0];
                changeLetterCommand = new CommandChangeLetter(letterToChange);

                expect(gameMaster.handleCommand(changeLetterCommand, activePlayer))
                    .to.be.equal(CommandExecutionStatus.ERROR_CHANGE_LETTER_STASH_EMPTY);

                done();
            });
        });

        describe('endTurn()', () => {
            it('should skip player\'s turn if he is the active player.', done => {
                let firstPlayer = gameMaster.getPlayers()[0];
                let secondPlayer = gameMaster.getPlayers()[1];
                let skipTurnCommand = new Command(CommandType.PASSER, CommandStatus.VALID_COMMAND);

                expect(gameMaster.handleCommand(skipTurnCommand,
                    (gameMaster.getActivePlayer().getSocketId() === firstPlayer.getSocketId()) ?
                        secondPlayer : firstPlayer)).to.be.equal(CommandExecutionStatus.WAIT);

                expect(gameMaster.handleCommand(skipTurnCommand,
                    gameMaster.getActivePlayer())).to.be.equal(CommandExecutionStatus.SUCCESS);

                expect(gameMaster.handleCommand(skipTurnCommand,
                    gameMaster.getActivePlayer())).to.be.equal(CommandExecutionStatus.SUCCESS);

                expect(gameMaster.handleCommand(skipTurnCommand,
                    (gameMaster.getActivePlayer().getSocketId() === firstPlayer.getSocketId()) ?
                        secondPlayer : firstPlayer)).to.be.equal(CommandExecutionStatus.WAIT);

                expect(gameMaster.handleCommand(skipTurnCommand,
                    gameMaster.getActivePlayer())).to.be.equal(CommandExecutionStatus.SUCCESS);

                expect(gameMaster.handleCommand(skipTurnCommand,
                    gameMaster.getActivePlayer())).to.be.equal(CommandExecutionStatus.SUCCESS);

                done();
            });
        });
    });
});
