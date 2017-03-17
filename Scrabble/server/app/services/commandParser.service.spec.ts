/**
 * commandParser.service.spec.ts
 *
 * @authors Pierre To et Mikael Ferland
 * @date 2017/03/05
 */

import { CommandParser } from './commandParser.service';
import { Command, CommandStatus, CommandType } from '../classes/command';
import { CommandPlaceWord } from '../classes/commandPlaceLetter';
import { CommandChangeLetter } from '../classes/commandChangeLetter';

import { expect } from 'chai';

describe('CommandParser', () => {

    let commandParser = new CommandParser();

    describe('Default constructor ', () => {
        it('should construct a CommandParser object.', done => {
            expect(commandParser).to.not.be.undefined;
            expect(commandParser).to.be.an.instanceOf(CommandParser);
            done();
        });
    });

    describe('isACommand() ', () => {
        it('should determine if the message entered by a user is a command (starts with "!".', done => {
            expect(commandParser.isACommand("!test test test    ")).to.be.true;
            expect(commandParser.isACommand("t!est")).to.be.false;
            expect(commandParser.isACommand("test")).to.be.false;
            expect(commandParser.isACommand("   !placer test ")).to.be.true;
            expect(commandParser.isACommand(" !changer")).to.be.true;
            expect(commandParser.isACommand("!passer")).to.be.true;
            expect(commandParser.isACommand("!aide ")).to.be.true;
            expect(commandParser.isACommand("!aider")).to.be.true;
            done();
        });
    });

    describe('createCommand() ', () => {
        it('should verify if a command exists.', done => {
            let command = commandParser.createCommand("!test test test    ");
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.UNDEFINED_COMMAND);

            command = commandParser.createCommand("!aider");
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.UNDEFINED_COMMAND);

            command = commandParser.createCommand("   !placer test ");
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            command = commandParser.createCommand(" !changer");
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            command = commandParser.createCommand("!passer");
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.VALID_COMMAND);

            command = commandParser.createCommand("!aide ");
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.VALID_COMMAND);

            done();
        });

        it('should verify if the command for placing a letter has proper syntax.', done => {
            // Insufficient arguments
            let command = commandParser.createCommand("!placer");
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);
            command = commandParser.createCommand("!placer g15v");
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Invalid row identifier
            command = commandParser.createCommand("!placer z15v bonjour");
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Invalid column identifier
            command = commandParser.createCommand("!placer a16v bonjour");
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Invalid word orientation
            command = commandParser.createCommand("!placer a15y bonjour");
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Invalid word (contains number)
            command = commandParser.createCommand("!placer a15h bo2njour");
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Too many arguments
            command = commandParser.createCommand("!placer a15v bonjour Pierre");
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Invalid word (contains more than 7 letters)
            command = commandParser.createCommand("!placer a15v bonjourno");
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Valid command
            let commandPlaceLetter: CommandPlaceWord;
            commandPlaceLetter = commandParser.createCommand("!placer a15H boNJouR") as CommandPlaceWord;
            expect(commandPlaceLetter).is.an.instanceOf(CommandPlaceWord);
            expect(commandPlaceLetter.getCommandType()).to.be.equal(CommandType.PLACER);
            expect(commandPlaceLetter.getCommandStatus()).to.be.equal(CommandStatus.VALID_COMMAND);
            expect(commandPlaceLetter.getRow()).to.be.equal("a");
            expect(commandPlaceLetter.getColumn()).to.be.equal(15);
            expect(commandPlaceLetter.getOrientation()).to.be.equal("h");
            expect(commandPlaceLetter.getWord()).to.be.equal("boNJouR");

            done();
        });

        it('should verify if the command for changing one or multiple letters has proper syntax.', done => {
            // Insufficient arguments
            let command = commandParser.createCommand("!changer");
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Too many arguments
            command = commandParser.createCommand("!changer a b");
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Too many letters to change
            command = commandParser.createCommand("!changer abcdefgh");
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Invalid letter sequence
            command = commandParser.createCommand("!changer ab3cde");
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Contains upscale letters
            command = commandParser.createCommand("!changer abcDef");
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Valid command
            let commandChangeLetter: CommandChangeLetter;
            commandChangeLetter = commandParser.createCommand("!changer abcd**z") as CommandChangeLetter;
            expect(commandChangeLetter).is.an.instanceOf(CommandChangeLetter);
            expect(commandChangeLetter.getCommandType()).to.be.equal(CommandType.CHANGER);
            expect(commandChangeLetter.getCommandStatus()).to.be.equal(CommandStatus.VALID_COMMAND);
            expect(commandChangeLetter.getLetters()).to.be.equal("abcd**z");

            done();
        });

        it('should verify if the command for skipping a turn has proper syntax.', done => {
            // Too many arguments
            let command = commandParser.createCommand("!passer a");
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);
            command = commandParser.createCommand("!passer 3 a");
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Valid command
            command = commandParser.createCommand("  !passer  ");
            expect(command).is.an.instanceOf(Command);
            expect(command.getCommandType()).to.be.equal(CommandType.PASSER);
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.VALID_COMMAND);

            done();
        });

        it('should verify if the command for displaying a help menu has proper syntax.', done => {
            // Too many arguments
            let command = commandParser.createCommand("!aide a");
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);
            command = commandParser.createCommand("!aide 3 a");
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Valid command
            command = commandParser.createCommand("!aide");
            expect(command).to.be.an.instanceOf(Command);
            expect(command.getCommandType()).to.be.equal(CommandType.AIDE);
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.VALID_COMMAND);

            done();
        });
    });
});
