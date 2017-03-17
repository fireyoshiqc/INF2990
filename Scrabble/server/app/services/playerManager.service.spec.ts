/**
 * playerManager.service.spec.ts
 *
 * @authors Vincent Chassé, Yawen Hou
 * @date 2017/02/17
 */

import { PlayerManager } from './playerManager.service';

import { expect } from 'chai';

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
            expect(testPlayerManager.validateName("player1")).to.be.true;
            done();
        });
    });

    describe('addPlayer ', () => {
        it('should add a player to playerNames array', done => {
            let testPlayer = testPlayerManager.addPlayer("player1", "1", 1);
            expect(testPlayer.getName()).to.be.equal("player1");
            expect(testPlayerManager.players.length).to.equal(1);
            done();
        });
    });

    describe('validateName ', () => {
        it('should return false when the name exists in the playerNames array', done => {
            expect(testPlayerManager.validateName("player1")).to.be.false;
            done();
        });
    });

    describe('removePlayer ', () => {
        it('should not remove a player that does not exist in the player name array', done => {
            testPlayerManager.removePlayer("Mimi");
            expect(testPlayerManager.players.length).to.equal(1);
            done();
        });

        it('should remove a player that exists in the player name array', done => {
            testPlayerManager.removePlayer("player1");
            expect(testPlayerManager.players).to.be.empty;
            done();
        });
    });

    describe('getPlayerFromSocketID', () => {
        it('should return the player based on the socketID', done => {
            testPlayerManager.addPlayer("Lilo", "123", 1);
            expect(testPlayerManager.getPlayerFromSocketID("123").getName()).to.equal("Lilo");
            done();
        });

        it('should return undefined when the socketId doesn\'t exist', done => {
            expect(testPlayerManager.getPlayerFromSocketID("333")).to.be.undefined;
            done();
        });
    });
});
