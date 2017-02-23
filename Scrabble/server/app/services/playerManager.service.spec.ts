/**
 * playerManager.service.spec.ts
 *
 * @authors Vincent Chassé, Yawen Hou
 * @date 2017/02/17
 */

import { PlayerManager } from './playerManager.service';

import { expect } from 'chai';

interface Player {
    roomId: number;
    name: string;
    socketId: string;
}

describe('PlayerManager', () => {

    let testPlayerManager = new PlayerManager();

    describe('Default constructor ', () => {
        it('should construct a PlayerManager object with valid playerNames array', done => {
            expect(testPlayerManager).to.not.be.undefined;
            expect(testPlayerManager.players).to.not.be.undefined;
            done();
        });
    });

    describe('validateName ', () => {
        it('should return true when the name does not exist in the playerNames array', done => {
            let testPlayer = {roomId: 0, name: "Lala"};
            expect(testPlayerManager.validateName(testPlayer.name)).to.be.true;
            done();
        });
    });

    describe('addPlayer ', () => {
        it('should add a player to playerNames array', done => {
            let testPlayer = {roomId: 0, name: "Lala", socketId: "123"};
            testPlayerManager.addPlayer(testPlayer);
            expect(testPlayerManager.players.length).to.equal(1);
            done();
        });
    });

    describe('validateName ', () => {
        it('should return false when the name exists in the playerNames array', done => {
            let testPlayer = {roomId: 0, name: "Lala"};
            expect(testPlayerManager.validateName(testPlayer.name)).to.be.false;
            done();
        });
    });

    describe('removePlayer ', () => {
        it('should not remove a player that does not exist in the player name array', done => {
            let testPlayer = {roomId: 0, name: "Mimi"};
            testPlayerManager.removePlayer(testPlayer.name);
            expect(testPlayerManager.players.length).to.equal(1);
            done();
        });

        it('should remove a player that exists in the player name array', done => {
            let testPlayer = {roomId: 0, name: "Lala"};
            testPlayerManager.removePlayer(testPlayer.name);
            expect(testPlayerManager.players).to.be.empty;
            done();
        });
    });

    describe('getSocketName', () => {
        it('should return the player based on the socketId ', done => {
            let testPlayer = {roomId: 0, name: "Lilo", socketId: "123"};
            testPlayerManager.addPlayer(testPlayer);
            expect(testPlayerManager.getSocketName("123")).to.equal(testPlayer);
            done();
        });

        it('should return undefined when the socketId doesn\'t exist', done => {
            expect(testPlayerManager.getSocketName("333")).to.be.undefined;
            done();
        });
    });
});
