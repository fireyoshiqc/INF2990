/**
 * roomManager.service.spec.ts
 *
 * @authors Mikael Ferland, Pierre To
 * @date 2017/02/19
 */

import { RoomManager } from './roomManager.service';
import { Player } from '../classes/player';

import { expect } from 'chai';

describe('RoomManager', () => {

    let roomManager = new RoomManager();

    describe('Default constructor', () => {
        it('should construct a RoomManager object.', done => {
            expect(roomManager).to.exist;
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
            let newRoom1 = roomManager.addRoom(2);
            let newRoom2 = roomManager.addRoom(3);
            let newRoom3 = roomManager.addRoom(4);

            expect(newRoom1.getRoomInfo().roomID).to.be.equal(0);
            expect(roomManager.findRoom(newRoom1.getRoomInfo().roomID).getRoomInfo().capacity).to.be.equal(2);

            expect(newRoom2.getRoomInfo().roomID).to.be.equal(1);
            expect(roomManager.findRoom(newRoom2.getRoomInfo().roomID).getRoomInfo().capacity).to.be.equal(3);

            expect(newRoom3.getRoomInfo().roomID).to.be.equal(2);
            expect(roomManager.findRoom(newRoom3.getRoomInfo().roomID).getRoomInfo().capacity).to.be.equal(4);
            done();
        });

        it('should have created three rooms.', done => {
            expect(roomManager.getExistingRooms().length).to.be.equal(3);
            done();
        });
    });

    describe('createRoom()', () => {
         it('should locate and return an existing room with the given capacity.', done => {
             expect(roomManager.createRoom(2).getRoomInfo().roomID).to.be.equal(0);
             expect(roomManager.createRoom(3).getRoomInfo().roomID).to.be.equal(1);
             expect(roomManager.createRoom(4).getRoomInfo().roomID).to.be.equal(2);
             done();
         });

         it('should locate and return room with no game started.', done => {
             roomManager.findRoom(0).getGameMaster().setGameStarted(true);
             expect(roomManager.createRoom(2).getRoomInfo().roomID).to.not.be.equal(0);
             done();
         });
     });

    describe('leaveRoom()', () => {
         it('should remove a player from a room.', done => {
             let room = roomManager.createRoom(2);
             let player = new Player("test", "1", room.getRoomInfo().roomID);
             room.addPlayer(player);

             expect(room.getPlayers()[0].getName()).to.be.equal("test");
             expect(roomManager.getExistingRooms().length).to.be.equal(4);

             roomManager.leaveRoom(player.getName(), room.getRoomInfo().roomID);

             expect(room.isEmpty()).to.be.true;
             expect(roomManager.getExistingRooms().length).to.be.equal(3);
             done();
         });
     });
});
