import { Room } from './room';

import { expect } from 'chai';

describe('Room', () => {

    let room = new Room(0, 4);

    describe('Default constructor', () => {
        it('should construct a Room object.', done => {
            expect(room).to.not.be.undefined;
            done();
        });
    });

    describe('getRoomID()', () => {
        it('should return 0.', done => {
            expect(room.getRoomID()).to.be.equal(0);
            done();
        });
    });

    describe('getNumberOfCurrentPlayers()', () => {
        it('should return 0.', done => {
            expect(room.getNumberOfCurrentPlayers()).to.be.equal(0);
            done();
        });
    });

    describe('getMaximumNumberOfPlayers()', () => {
        it('should return 4.', done => {
            expect(room.getCapacity()).to.be.equal(4);
            done();
        });
    });

    describe('isWaiting()', () => {
        it('should return true because the room is currently empty.', done => {
            expect(room.getIsWaiting()).to.be.true;
            done();
        });

        it('should return false because the room is now in progress.', done => {
            room.play();
            expect(room.getIsWaiting()).to.be.false;
            done();
        });
    });

    describe('addPlayer()', () => {
        it('should increment the number of players in the room.', done => {
            // Try adding five players in a room of 4
            expect(room.addPlayer()).to.be.true;
            expect(room.getNumberOfCurrentPlayers()).to.be.equal(1);
            expect(room.addPlayer()).to.be.true;
            expect(room.addPlayer()).to.be.true;
            expect(room.addPlayer()).to.be.true;
            expect(room.addPlayer()).to.be.false;
            expect(room.getNumberOfCurrentPlayers()).to.be.equal(4);
            done();
        });
    });

    describe('isFull()', () => {
        it('should return true when a room is full.', done => {
            expect(room.isFull()).to.be.true;
            done();
        });
    });

    describe('removePlayer()', () => {
        it('should decrement the number of players in the room.', done => {
            // Try removing five players in a room of 4
            expect(room.removePlayer()).to.be.true;
            expect(room.getNumberOfCurrentPlayers()).to.be.equal(3);
            expect(room.removePlayer()).to.be.true;
            expect(room.removePlayer()).to.be.true;
            expect(room.removePlayer()).to.be.true;
            expect(room.removePlayer()).to.be.false;
            expect(room.getNumberOfCurrentPlayers()).to.be.equal(0);
            done();
        });
    });
});
