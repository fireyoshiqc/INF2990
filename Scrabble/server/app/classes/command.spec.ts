/**
 * command.spec.ts
 *
 * @authors Mikael Ferland, Pierre To
 * @date 2017/03/11
 */

import { Command, CommandType, CommandStatus } from './command';

import { expect } from 'chai';

describe('Command', () => {

    let command = new Command(CommandType.PLACER, CommandStatus.VALID_COMMAND);

    describe('Default constructor', () => {
        it('should construct a Command object.', done => {
            expect(command).to.not.be.undefined;
            expect(command).to.be.an.instanceOf(Command);
            expect(command.getCommandType()).to.be.equal(CommandType.PLACER);
            expect(command.getCommandStatus()).to.be.equal(CommandStatus.VALID_COMMAND);
            done();
        });
    });
});
