/**
 * commandPlaceLetter.spec.ts
 *
 * @authors Mikael Ferland, Pierre To
 * @date 2017/03/11
 */

import { Command, CommandType, CommandStatus } from './command';
import { CommandPlaceWord } from './commandPlaceWord';

import { expect } from 'chai';

describe('commandPlaceWord', () => {

    let command = new CommandPlaceWord("a", 1, "v", "bonjour");

    describe('Default constructor', () => {
        it('should construct a CommandPlaceLetter object with the supplied parameters.', done => {
            expect(command).to.not.be.undefined;
            expect(command).to.be.an.instanceOf(Command);
            expect(command).to.be.an.instanceOf(CommandPlaceWord);

            expect(command.getCommandType()).to.be.equal(CommandType.PLACER);
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.VALID_COMMAND);
            expect(command.getRow()).to.be.equal(0);
            expect(command.getColumn()).to.be.equal(0);
            expect(command.getOrientation()).to.be.equal("v");
            expect(command.getWord()).to.be.equal("bonjour");
            done();
        });
    });
});
