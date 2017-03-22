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

import { expect } from 'chai';

describe('GameMaster', () => {
    let players = [new Player("player1", "1", 1), new Player("player2", "2", 1)];
    let gameMaster = new GameMaster(players);

    describe('Default constructor', () => {
        it('should construct a GameMaster object.', done => {
            expect(gameMaster).to.not.be.undefined;
            expect(gameMaster).to.be.an.instanceOf(GameMaster);
            expect(gameMaster.getScrabbleGame()).to.be.an.instanceOf(ScrabbleGame);
            expect(gameMaster.getPlayers()[0].getName()).to.be.equal("player1");
            expect(gameMaster.getPlayers()[1].getName()).to.be.equal("player2");
            expect(gameMaster.getActivePlayer()).to.be.undefined;
            expect(gameMaster.isGameStarted()).to.be.false;
            expect(gameMaster.getTurnInfo().minutes).to.be.equal(0);
            expect(gameMaster.getTurnInfo().seconds).to.be.equal(0);
            expect(gameMaster.getTurnInfo().activePlayerName).to.be.equal("");
            expect(gameMaster.getIsFirstTurn()).to.be.true;
            done();
        });
    });

    describe('SwapPlayers()', () => {
        it('should swap two players\' order.', done => {
            expect(gameMaster.getPlayers()[0].getName()).to.be.equal("player1");
            expect(gameMaster.getPlayers()[1].getName()).to.be.equal("player2");

            gameMaster.swapPlayer(0, 1);

            expect(gameMaster.getPlayers()[0].getName()).to.be.equal("player2");
            expect(gameMaster.getPlayers()[1].getName()).to.be.equal("player1");
            done();
        });
    });

    describe('StartGame()', () => {
        it('should start the game.', done => {
            gameMaster.startGame();

            expect(gameMaster.isGameStarted()).to.be.true;
            done();
        });
    });

    describe('SkipTurn()', () => {
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

    describe('placeWord()', () => {
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
