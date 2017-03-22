/**
 * CommandHandler.service.spec.ts
 *
 * @authors Pierre To et Mikael Ferland
 * @date 2017/03/05
 */

import { CommandHandler } from './commandHandler.service';
import { RoomManager } from '../services/roomManager.service';

import { expect } from 'chai';

describe('CommandHandler', () => {
    let roomManager = new RoomManager();
    let commandHandler = new CommandHandler(null, roomManager);

    describe('Default constructor ', () => {
        it('should construct a CommandHandler object.', done => {
            expect(commandHandler).to.not.be.undefined;
            expect(commandHandler).to.be.an.instanceOf(CommandHandler);
            done();
        });
    });

    describe('isACommand() ', () => {
        it('should determine if the message entered by a user is a command (starts with "!".', done => {
            expect(commandHandler.isACommand("!test test test    ")).to.be.true;
            expect(commandHandler.isACommand("t!est")).to.be.false;
            expect(commandHandler.isACommand("test")).to.be.false;
            expect(commandHandler.isACommand("   !placer test ")).to.be.true;
            expect(commandHandler.isACommand(" !changer")).to.be.true;
            expect(commandHandler.isACommand("!passer")).to.be.true;
            expect(commandHandler.isACommand("!aide ")).to.be.true;
            expect(commandHandler.isACommand("!aider")).to.be.true;
            done();
        });
    });
});
