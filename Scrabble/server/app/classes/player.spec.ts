/**
 * player.spec.ts
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/03/15
 */

import { Player } from './player';
import { Letter } from './letter';

import { expect } from 'chai';

describe('Player', () => {

    let player = new Player("PlayerName", "SocketID", 1);

    describe('Default constructor', () => {
        it('should construct a Player object.', done => {
            expect(player).to.not.be.undefined;
            expect(player).to.be.an.instanceOf(Player);
            expect(player.getName()).to.be.equal("PlayerName");
            expect(player.getSocketId()).to.be.equal("SocketID");
            expect(player.getRoomId()).to.be.equal(1);
            expect(player.getPoints()).to.be.equal(0);
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

    describe('addLetter()', () => {
        it('should add 7 letters to the letters rack of the player.', done => {
            expect(player.addLetter(new Letter("a"))).to.be.true;
            expect(player.addLetter(new Letter("b"))).to.be.true;
            expect(player.addLetter(new Letter("c"))).to.be.true;
            expect(player.addLetter(new Letter("d"))).to.be.true;
            expect(player.addLetter(new Letter("e"))).to.be.true;
            expect(player.addLetter(new Letter("f"))).to.be.true;
            expect(player.addLetter(new Letter("g"))).to.be.true;

            done();
        });

        it('should not add a 8th letter to the letters rack of the player.', done => {
            expect(player.addLetter(new Letter("x"))).to.be.false;
            done();
        });
    });

    describe('removeLetter()', () => {
        it('should remove a letter from the letters rack of the player.', done => {
            expect(player.removeLetters(["c"])).to.be.true;
            done();
        });

        it('should not remove a letter from the letters rack of the player.', done => {
            expect(player.removeLetters(["z"])).to.be.false;
            done();
        });
    });
});
