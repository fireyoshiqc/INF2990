/**
 * gameRenderer.spec.ts - Tests for the rendering of the scene
 *
 * @authors Félix Boulet et Yawen Hou
 * @date 2017/01/27
 */

import { GameRenderer } from './gameRenderer';
import { GameController } from './gameController.service';
import { CurlingStone, Team } from '../entities/curlingStone';

import { expect } from 'chai';

describe('GameRenderer', () => {
    let testCurlingStones = new Array<CurlingStone>();
    let dummyGameController = new GameController();
    let testRenderer = new GameRenderer(testCurlingStones, dummyGameController);

    describe('Default constructor ', () => {
        it('should construct an empty GameRenderer object.', done => {
            testRenderer = new GameRenderer(testCurlingStones, dummyGameController);
            expect(testRenderer).to.be.an.instanceof(GameRenderer);
            done();
        });
    });

    describe('init()', () => {
        it('should start the game renderer without a provided HTMLElement (that cannot be tested).', done => {
            testRenderer.init();
            expect(testRenderer.getIsStarted()).to.be.true;
            done();
        });
    });

    describe('addToScene()', () => {
        it('should add a Group object (like a Curling Stone) to its contained Scene.', done => {
            let testStone : CurlingStone = new CurlingStone(Team.Player);
            testRenderer.addToScene(testStone);
            expect(testRenderer.getScene().children).to.be.ok;
            done();
        });
    });

    describe('showDirectionCurve()', () => {
        it ('should add a curveObject to the scene', done => {
            testRenderer.showDirectionCurve();
            expect(testRenderer.getScene().getObjectByName("directionalCurve")).to.exist;
            done();
        });
    });

    describe('hideDirectionCurve()', () => {
        it ('should remove a curveObject from the scene', done => {
            testRenderer.hideDirectionCurve();
            expect(testRenderer.getScene().getObjectByName("directionalCurve")).to.not.exist;
            done();
        });
    });
    // Those tests may or may not work depending on the size of the window Karma opens in, hence why they're commented
    /**
     describe('calculateAngle()', () => {
        it ('should return a valid angle when the mouse is placed on the rink', done => {
            let mouse = new THREE.Vector2(-0.15170278637770895, -0.07210884353741487);
            let angle = testRenderer.calculateAngle(mouse);
            expect(angle).to.be.within(0, 30);
            done();
        });

        it ('should return a null when when the mouse is placed outside of the rink', done => {
            let mouse = new THREE.Vector2(10000, 10000);
            let angle = testRenderer.calculateAngle(mouse);
            expect(angle).to.be.null;
            done();
        });
    });
     */
});
