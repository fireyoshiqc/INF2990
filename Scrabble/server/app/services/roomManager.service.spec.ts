/**
 * roomManager.service.spec.ts
 *
 * @authors Mikael Ferland, Pierre To
 * @date 2017/02/19
 */

import { RoomManager } from './roomManager.service';

import { expect } from 'chai';

describe('RoomManager', () => {

    let roomManager = new RoomManager();

    describe('Default constructor', () => {
        it('should construct a RoomManager object.', done => {
            expect(roomManager).to.not.be.undefined;
            done();
        });
    });

    describe('getExistingRooms()', () => {
        it('should return the list of existing rooms.', done => {
            expect(roomManager.getExistingRooms().length).to.be.equal(0);
            done();
        });
    });

    describe('findRoom()', () => {
        it('should locate and return an existing room with the given capacity.', done => {
            expect(roomManager.findRoom(2)).to.be.undefined;
            expect(roomManager.findRoom(3)).to.be.undefined;
            expect(roomManager.findRoom(4)).to.be.undefined;
            done();
        });
    });

    describe('addRoom()', () => {
        it('should create a room.', done => {
            expect(roomManager.addRoom(2).getRoomInfo().roomID).to.be.equal(0);
            expect(roomManager.findRoom(2).getRoomInfo().capacity).to.be.equal(2);

            expect(roomManager.addRoom(3).getRoomInfo().roomID).to.be.equal(1);
            expect(roomManager.findRoom(3).getRoomInfo().capacity).to.be.equal(3);

            expect(roomManager.addRoom(4).getRoomInfo().roomID).to.be.equal(2);
            expect(roomManager.findRoom(4).getRoomInfo().capacity).to.be.equal(4);
            done();
        });

        it('should have created three rooms.', done => {
            expect(roomManager.getExistingRooms().length).to.be.equal(3);
            done();
        });
    });

    describe('joinRoom()', () => {
         it('should locate and return an existing room with the given capacity.', done => {
             expect(roomManager.joinRoom({name: "Joueur1", capacity: 2}).getRoomInfo().roomID).to.be.equal(0);
             expect(roomManager.joinRoom({name: "Joueur2", capacity: 3}).getRoomInfo().roomID).to.be.equal(1);
             expect(roomManager.joinRoom({name: "Joueur3", capacity: 4}).getRoomInfo().roomID).to.be.equal(2);
             done();
         });
     });
});
