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
            let testPlayer = "Lala";
            expect(testPlayerManager.validateName(testPlayer)).to.be.true;
            done();
        });
    });

    describe('addPlayer ', () => {
        it('should add a player to playerNames array', done => {
            let testPlayer = "Lala";
            testPlayerManager.addPlayer({ roomId: 0, name: testPlayer });
            expect(testPlayerManager.players.length).to.equal(1);
            done();
        });
    });

    describe('validateName ', () => {
        it('should return false when the name exists in the playerNames array', done => {
            let testPlayer = "Lala";
            expect(testPlayerManager.validateName(testPlayer)).to.be.false;
            done();
        });
    });

    describe('removePlayer ', () => {
        it('should not remove a player that does not exist in the player name array', done => {
            let testPlayer = "Mimi";
            testPlayerManager.removePlayer(testPlayer);
            expect(testPlayerManager.players.length).to.equal(1);
            done();
        });

        it('should remove a player that exists in the player name array', done => {
            let testPlayer = "Lala";
            testPlayerManager.removePlayer(testPlayer);
            expect(testPlayerManager.players).to.be.empty;
            done();
        });
    });
});
