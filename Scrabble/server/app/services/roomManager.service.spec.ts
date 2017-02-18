import { Room } from '../classes/room';
import { RoomManager } from './roomManager.service';
import * as io from 'socket.io';

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
            expect(roomManager.addRoom(2).getRoomID()).to.be.equal(0);
            expect(roomManager.findRoom(2).getCapacity()).to.be.equal(2);

            expect(roomManager.addRoom(3).getRoomID()).to.be.equal(1);
            expect(roomManager.findRoom(3).getCapacity()).to.be.equal(3);

            expect(roomManager.addRoom(4).getRoomID()).to.be.equal(2);
            expect(roomManager.findRoom(4).getCapacity()).to.be.equal(4);
            done();
        });

        it('should have created three rooms.', done => {
            expect(roomManager.getExistingRooms().length).to.be.equal(3);
            done();
        });
    });

    // describe('joinRoom()', () => {
    //     it('should connect a player to an existing or a new room.', done => {

    //         roomManager.joinRoom(clientSocket, 8);

    //         expect(roomManager.findRoom(8).getNumberOfCurrentPlayers()).to.be.equal(1);
    //         done();
    //     });
    // });
});
