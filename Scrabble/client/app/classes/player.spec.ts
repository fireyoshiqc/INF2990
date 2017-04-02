/**
 * player.spec.ts
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/04/02
 */

import { Player } from './player';

import { expect } from 'chai';

describe('Player', () => {

    let player = new Player();

    describe('Default constructor', () => {
        it('should construct a Player object.', done => {
            expect(player).to.exist;
            expect(player).to.be.an.instanceOf(Player);
            expect(player.getName()).to.be.equal("");
            expect(player.getNameValid()).to.be.false;
            expect(player.getRoomID()).to.be.equal(-1);
            done();
        });
    });

    describe('Setters/Getters', () => {
        it('should set/get a Player object attributes.', done => {
            player.setName("Joueur 1");
            player.setNameValid(true);
            player.setRoomID(0);

            expect(player.getName()).to.be.equal("Joueur 1");
            expect(player.getNameValid()).to.be.true;
            expect(player.getRoomID()).to.be.equal(0);
            done();
        });
    });
});
