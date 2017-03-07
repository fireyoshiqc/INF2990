/**
 * commandParser.service.spec.ts
 *
 * @authors Pierre To et Mikael Ferland
 * @date 2017/03/05
 */

import { CommandParser, CommandStatus } from './commandParser.service';

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
            expect(command.commandStatus).to.be.equal(CommandStatus.UNDEFINED_COMMAND);

            command = commandParser.createCommand("!aider");
            expect(command.commandStatus).to.be.equal(CommandStatus.UNDEFINED_COMMAND);

            command = commandParser.createCommand("   !placer test ");
            expect(command.commandStatus).to.not.be.equal(CommandStatus.UNDEFINED_COMMAND);

            command = commandParser.createCommand(" !changer");
            expect(command.commandStatus).to.not.be.equal(CommandStatus.UNDEFINED_COMMAND);

            command = commandParser.createCommand("!passer");
            expect(command.commandStatus).to.not.be.equal(CommandStatus.UNDEFINED_COMMAND);

            command = commandParser.createCommand("!aide ");
            expect(command.commandStatus).to.not.be.equal(CommandStatus.UNDEFINED_COMMAND);

            done();
        });

        it('should verify if the command for placing a letter has proper syntax.', done => {
            // Insufficient arguments
            let command = commandParser.createCommand("!placer");
            expect(command.commandStatus).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);
            command = commandParser.createCommand("!placer g15v");
            expect(command.commandStatus).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Invalid row identifier
            command = commandParser.createCommand("!placer z15v bonjour");
            expect(command.commandStatus).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Invalid column identifier
            command = commandParser.createCommand("!placer a16v bonjour");
            expect(command.commandStatus).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Invalid word orientation
            command = commandParser.createCommand("!placer a15y bonjour");
            expect(command.commandStatus).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Invalid word (contains number)
            command = commandParser.createCommand("!placer a15h bo2njour");
            expect(command.commandStatus).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Too many arguments
            command = commandParser.createCommand("!placer a15v bonjour Pierre");
            expect(command.commandStatus).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Invalid word (contains more than 7 letters)
            command = commandParser.createCommand("!placer a15v bonjourno");
            expect(command.commandStatus).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Valid command
            command = commandParser.createCommand("!placer a15v boNJouR");
            expect(command.commandStatus).to.be.equal(CommandStatus.VALID_COMMAND);

            done();
        });

        it('should verify if the command for changing one or multiple letters has proper syntax.', done => {
            // Insufficient arguments
            let command = commandParser.createCommand("!changer");
            expect(command.commandStatus).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Too many arguments
            command = commandParser.createCommand("!changer a b");
            expect(command.commandStatus).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Too many letters to change
            command = commandParser.createCommand("!changer abcdefgh");
            expect(command.commandStatus).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Invalid letter sequence
            command = commandParser.createCommand("!changer ab3cde");
            expect(command.commandStatus).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Contains upscale letters
            command = commandParser.createCommand("!changer abcDef");
            expect(command.commandStatus).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Valid command
            command = commandParser.createCommand("!changer abcd**z");
            expect(command.commandStatus).to.be.equal(CommandStatus.VALID_COMMAND);

            done();
        });

        it('should verify if the command for skipping a turn has proper syntax.', done => {
            // Too many arguments
            let command = commandParser.createCommand("!passer a");
            expect(command.commandStatus).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);
            command = commandParser.createCommand("!passer 3 a");
            expect(command.commandStatus).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Valid command
            command = commandParser.createCommand("  !passer  ");
            expect(command.commandStatus).to.be.equal(CommandStatus.VALID_COMMAND);

            done();
        });

        it('should verify if the command for displaying a help menu has proper syntax.', done => {
            // Too many arguments
            let command = commandParser.createCommand("!aide a");
            expect(command.commandStatus).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);
            command = commandParser.createCommand("!aide 3 a");
            expect(command.commandStatus).to.be.equal(CommandStatus.INVALID_COMMAND_SYNTAX);

            // Valid command
            command = commandParser.createCommand("!aide");
            expect(command.commandStatus).to.be.equal(CommandStatus.VALID_COMMAND);

            done();
        });
    });
});
