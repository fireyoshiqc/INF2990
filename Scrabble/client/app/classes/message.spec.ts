/**
 * message.spec.ts
 *
 * @authors Pierre To and Mikael Ferland
 * @date 2017/03/11
 */

import { Message } from './message';

import { expect } from 'chai';

describe('Message', () => {

    let msgFromServer = {username: "username", submessage: "submessage" };
    let msg = new Message(msgFromServer);

    describe('Default constructor', () => {
        it('should construct a Message object.', done => {
            expect(msg).to.exist;
            expect(msg).to.be.an.instanceOf(Message);
            expect(msg.getUsername()).to.be.equal("username");
            expect(msg.getSubmessage()).to.be.equal("submessage");
            expect(msg.getCommandResponse()).to.be.equal("");
            expect(msg.getIsCommand()).to.be.false;
            done();
        });
    });

    let commandFromServer = {username: "username", submessage: "submessage", commandResponse: "errorMessage"};
    let command = new Message(commandFromServer, true);

    describe('Default constructor for commands', () => {
        it('should construct a Message object which is a command.', done => {
            expect(command).to.exist;
            expect(command).to.be.an.instanceOf(Message);
            expect(command.getUsername()).to.be.equal("username");
            expect(command.getSubmessage()).to.be.equal("submessage");
            expect(command.getCommandResponse()).to.be.equal("errorMessage");
            expect(command.getIsCommand()).to.be.true;
            done();
        });
    });
});
