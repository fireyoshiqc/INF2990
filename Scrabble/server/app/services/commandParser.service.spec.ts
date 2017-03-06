/**
 * commandParser.service.spec.ts
 *
 * @authors Pierre To et Mikael Ferland
 * @date 2017/03/05
 */

import { CommandParser } from './commandParser.service';

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
        it('should determine if the message entered by a user is a command.', done => {
            expect(commandParser.isACommand("!test test test    ")).to.be.false;
            expect(commandParser.isACommand("t!est")).to.be.false;
            expect(commandParser.isACommand("test")).to.be.false;
            expect(commandParser.isACommand("   !placer test ")).to.be.true;
            expect(commandParser.isACommand(" !changer")).to.be.true;
            expect(commandParser.isACommand("!passer")).to.be.true;
            expect(commandParser.isACommand("!aide ")).to.be.true;
            expect(commandParser.isACommand("!aider")).to.be.false;
            done();
        });
    });

    describe('validatePlaceLetterSyntax() ', () => {
        it('should verify if the command for placing a letter has proper syntax.', done => {
            // Insufficient arguments
            commandParser.isACommand("!placer");
            expect(commandParser.validatePlaceLetterSyntax()).to.be.false;
            commandParser.isACommand("!placer g15v");
            expect(commandParser.validatePlaceLetterSyntax()).to.be.false;

            // Invalid row identifier
            commandParser.isACommand("!placer z15v bonjour");
            expect(commandParser.validatePlaceLetterSyntax()).to.be.false;

            // Invalid column identifier
            commandParser.isACommand("!placer a16v bonjour");
            expect(commandParser.validatePlaceLetterSyntax()).to.be.false;

            // Invalid word orientation
            commandParser.isACommand("!placer a15y bonjour");
            expect(commandParser.validatePlaceLetterSyntax()).to.be.false;

            // Invalid word (contains number)
            commandParser.isACommand("!placer a15h bo2njour");
            expect(commandParser.validatePlaceLetterSyntax()).to.be.false;

            // Too many arguments
            commandParser.isACommand("!placer a15v bonjour Pierre");
            expect(commandParser.validatePlaceLetterSyntax()).to.be.false;

            // Invalid word (contains more than 7 letters)
            commandParser.isACommand("!placer a15v bonjourno");
            expect(commandParser.validatePlaceLetterSyntax()).to.be.false;

            // Valid command
            commandParser.isACommand("!placer a15v boNJouR");
            expect(commandParser.validatePlaceLetterSyntax()).to.be.true;

            done();
        });
    });

    describe('validateChangeLetterSyntax() ', () => {
        it('should verify if the command for changing one or multiple letters has proper syntax.', done => {
            // Insufficient arguments
            commandParser.isACommand("!changer");
            expect(commandParser.validateChangeLetterSyntax()).to.be.false;

            // Too many arguments
            commandParser.isACommand("!changer a b");
            expect(commandParser.validateChangeLetterSyntax()).to.be.false;

            // Too many letters to change
            commandParser.isACommand("!changer abcdefgh");
            expect(commandParser.validateChangeLetterSyntax()).to.be.false;

            // Invalid letter sequence
            commandParser.isACommand("!changer ab3cde");
            expect(commandParser.validateChangeLetterSyntax()).to.be.false;

            // Contains upscale letters
            commandParser.isACommand("!changer abcDef");
            expect(commandParser.validateChangeLetterSyntax()).to.be.false;

            // Valid command
            commandParser.isACommand("!changer abcd**z");
            expect(commandParser.validateChangeLetterSyntax()).to.be.true;

            done();
        });
    });
});
