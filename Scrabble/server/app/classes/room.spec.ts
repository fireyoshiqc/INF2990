/**
 * room.spec.ts
 *
 * @authors Mikael Ferland, Pierre To
 * @date 2017/02/19
 */

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

    describe('getRoomInfo()', () => {
        it('should return default room info.', done => {
            expect(room.getRoomInfo().roomID).to.be.equal(0);
            expect(room.getRoomInfo().playerList.length).to.be.equal(0);
            expect(room.getRoomInfo().capacity).to.be.equal(4);
            done();
        });
    });

    describe('addPlayer()', () => {
        it('should increment the number of players in the room.', done => {
            // Try adding five players in a room of 4
            room.addPlayer("Joueur1");
            expect(room.getRoomInfo().playerList.find(playerName => playerName === "Joueur1")).to.be.equal("Joueur1");
            expect(room.getRoomInfo().playerList.length).to.be.equal(1);
            room.addPlayer("Joueur2");
            room.addPlayer("Joueur3");
            room.addPlayer("Joueur4");
            expect(room.getRoomInfo().playerList.length).to.be.equal(4);
            room.addPlayer("Joueur5"); // shouldn't do anything
            expect(room.getRoomInfo().playerList.length).to.be.equal(4);
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
            room.removePlayer("Joueur1");
            expect(room.getRoomInfo().playerList.find(playerName => playerName === "Joueur1")).to.be.undefined;
            expect(room.getRoomInfo().playerList.length).to.be.equal(3);
            room.removePlayer("Joueur2");
            room.removePlayer("Joueur3");
            room.removePlayer("Joueur4");
            expect(room.getRoomInfo().playerList.length).to.be.equal(0);
            room.removePlayer("Joueur5"); // shouldn't do anything
            expect(room.getRoomInfo().playerList.length).to.be.equal(0);
            done();
        });
    });

    describe('isEmpty()', () => {
        it('should return true when a room is empty.', done => {
            expect(room.isEmpty()).to.be.true;
            done();
        });
    });
});
