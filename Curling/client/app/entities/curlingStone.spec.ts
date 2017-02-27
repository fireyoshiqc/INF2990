/**
 * curlingStone.spec.ts - Tests for the curling stone
 *
 * @authors Félix Boulet et Yawen Hou
 * @date 2017/01/20
 */

import { CurlingStone, Team } from './curlingStone';

import { expect } from 'chai';

describe('CurlingStone', () => {

    let testStone : CurlingStone;


    describe('Default constructor ', () => {
        it('should construct an empty (non-rendered) CurlingStone object.', done => {
            testStone = new CurlingStone(Team.Player);
            expect(testStone).to.not.be.undefined;
            expect(testStone).to.be.an.instanceof(CurlingStone);
            expect(testStone).to.be.an.instanceof(THREE.Group);
            expect(testStone.getTeam()).to.be.equal(Team.Player);
            done();
        });
        it('should make a CurlingStone object.', done => {
            testStone = new CurlingStone(Team.Player);
            expect(testStone.stoneColor).to.equal("#66B2FF");
            done();
        });
        it('should make a colored CurlingStone object if a valid color format is entered.', done => {
            CurlingStone.setPlayerStoneColor("#FF0000");
            testStone = new CurlingStone(Team.Player, null, null);
            expect(testStone.stoneColor).to.equal("#FF0000");
            done();
        });
        it('should make a CurlingStone object if an incorrect string is entered.', done => {
            CurlingStone.setPlayerStoneColor("DEADBEEF");
            testStone = new CurlingStone(Team.Player, null, null);
            expect(testStone.stoneColor).to.not.equal("DEADBEEF");
            expect(testStone.stoneColor).to.equal("#FF0000");
            done();
        });
    });

    describe('init()', () => {
        it('should add a Curling Stone base (mesh) and a cover (mesh) to the group object.', done => {
            testStone = new CurlingStone(Team.Player);
            testStone.init();
            expect(testStone.children.length).to.equal(2);
            done();
        });
    });
});
