/**
 * player.spec.ts
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/03/15
 */

import { Player } from './player';
import { Letter } from './letter';
import { CommandExecutionStatus } from '../services/gameMaster.service';

import { expect } from 'chai';

describe('Player', () => {

    let player = new Player("PlayerName", "SocketID", 1);

    describe('Default constructor', () => {
        it('should construct a Player object.', done => {
            expect(player).to.exist;
            expect(player).to.be.an.instanceOf(Player);
            expect(player.getName()).to.be.equal("PlayerName");
            expect(player.getSocketId()).to.be.equal("SocketID");
            expect(player.getRoomId()).to.be.equal(1);
            expect(player.getPoints()).to.be.equal(0);
            expect(player.isRackEmpty()).to.be.true;
            expect(player.getMaxRackSize()).to.be.equal(7);
            expect(player.getIsBlocked()).to.be.false;
            done();
        });
    });

    describe('block() and unblock()', () => {
        it('should block and unblock a player.', done => {
            expect(player.getIsBlocked()).to.be.false;
            player.block();
            expect(player.getIsBlocked()).to.be.true;
            player.unblock();
            expect(player.getIsBlocked()).to.be.false;
            done();
        });
    });

    describe('addPoints()', () => {
        it('should add points to the player\'s score.', done => {
            player.addPoints(10);
            expect(player.getPoints()).to.be.equal(10);
            done();
        });
    });

    describe('setLetters()', () => {
        it('should set the letters rack of the player.', done => {
            let playerTest = new Player("test", "1", 1);
            let letters = new Array<Letter>();
            letters.push(new Letter("a"));
            letters.push(new Letter("b"));
            letters.push(new Letter("c"));
            playerTest.setLetters(letters);
            expect(playerTest.getLettersRack()).to.be.eql(["A", "B", "C"]);
            done();
        });
    });

    describe('addLetters()', () => {
        it('should add 7 letters to the letters rack of the player.', done => {
            let letters = [];
            letters.push(new Letter("JOKER"));
            letters.push(new Letter("b"));
            letters.push(new Letter("c"));
            letters.push(new Letter("d"));
            letters.push(new Letter("e"));
            letters.push(new Letter("f"));
            letters.push(new Letter("g"));
            player.addLetters(letters);

            expect(player.getLettersRack()).to.eql(["JOKER", "B", "C", "D", "E", "F", "G"]);
            done();
        });

        it('should not add a 8th letter to the letters rack of the player.', done => {
            let letters = [];
            letters.push(new Letter("x"));
            player.addLetters(letters);

            expect(player.getLettersRack()).to.eql(["JOKER", "B", "C", "D", "E", "F", "G"]);
            done();
        });
    });

    describe('removeLetters()', () => {
        it('should remove a letter from the letters rack of the player.', done => {
            expect(player.removeLetters(["JOKER", "B"])).to.be.equal(CommandExecutionStatus.SUCCESS_REMOVE_LETTERS);
            expect(player.getLettersRack()).to.eql(["C", "D", "E", "F", "G"]);
            done();
        });

        it('should not remove a letter from the letters rack of the player.', done => {
            expect(player.removeLetters(["C", "D", "Z"])).to.be.equal(CommandExecutionStatus.ERROR_REMOVE_LETTERS);
            expect(player.getLettersRack()).to.eql(["C", "D", "E", "F", "G"]);
            done();
        });
    });
});
