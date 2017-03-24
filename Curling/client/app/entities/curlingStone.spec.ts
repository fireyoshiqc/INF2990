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

            expect(testStone).to.exist;
            expect(testStone).to.be.an.instanceof(CurlingStone);
            expect(testStone).to.be.an.instanceof(THREE.Group);
            expect(testStone.getTeam()).to.be.equal(Team.Player);
            done();
        });

        it('should make a CurlingStone object.', done => {
            testStone = new CurlingStone(Team.Player);

            expect(testStone.getColor()).to.equal("#488957");
            done();
        });

        it('should make a colored CurlingStone object if a valid color format is entered.', done => {
            CurlingStone.setPlayerStoneColor("#FF0000");
            testStone = new CurlingStone(Team.Player, null, null);

            expect(testStone.getColor()).to.equal("#FF0000");
            done();
        });

        it('should make a CurlingStone object if an incorrect string is entered.', done => {
            CurlingStone.setPlayerStoneColor("DEADBEEF");
            testStone = new CurlingStone(Team.Player, null, null);

            expect(testStone.getColor()).to.not.equal("DEADBEEF");
            expect(testStone.getColor()).to.equal("#FF0000");
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

    describe('highlightOn()', () => {
        it('should add an outline mesh to the curling stone and its handle.', done => {
            testStone.highlightOn();

            let stoneMesh = testStone.children[0];
            let handleMesh = testStone.children[1];

            expect(stoneMesh.children.length).to.equal(1);
            expect(stoneMesh.children[0]).to.be.instanceOf(THREE.Mesh);
            expect(handleMesh.children.length).to.equal(1);
            expect(handleMesh.children[0]).to.be.instanceOf(THREE.Mesh);
            done();
        });
    });

    describe('highlightOff()', () => {
        it('should remove the outline mesh from the curling stone and its handle.', done => {
            testStone.highlightOff();

            let stoneMesh = testStone.children[0];
            let handleMesh = testStone.children[1];

            expect(stoneMesh.children.length).to.equal(0);
            expect(handleMesh.children.length).to.equal(0);
            done();
        });
    });
});
