/**
 * commandChangeLetter.spec.ts
 *
 * @authors Mikael Ferland, Pierre To
 * @date 2017/03/11
 */

import { Command, CommandType, CommandStatus } from './command';
import { CommandChangeLetter } from './commandChangeLetter';

import { expect } from 'chai';

describe('CommandChangeLetter', () => {

    let command = new CommandChangeLetter("ab**cde");

    describe('Default constructor', () => {
        it('should construct a CommandChangeLetter object with the supplied parameters.', done => {
            expect(command).to.not.be.undefined;
            expect(command).to.be.an.instanceOf(Command);
            expect(command).to.be.an.instanceOf(CommandChangeLetter);

            expect(command.getCommandType()).to.be.equal(CommandType.CHANGER);
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.VALID_COMMAND);
            expect(command.getLetters()).to.be.equal("ab**cde");
            done();
        });
    });
});
