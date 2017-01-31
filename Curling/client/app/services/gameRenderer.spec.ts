/**
 * gameRenderer.spec.ts - Tests for the rendering of the scene
 *
 * @authors Félix Boulet et Yawen Hou
 * @date 2017/01/27
 */

import { GameRenderer } from './gameRenderer';
import { CurlingStone } from '../entities/curlingStone';

import { expect } from 'chai';

describe('GameRenderer', () => {
    let testRenderer : GameRenderer;
    testRenderer = new GameRenderer();

    describe('Default constructor ', () => {
        it('should construct an empty GameRenderer object.', done => {
            testRenderer = new GameRenderer();
            expect(testRenderer).to.be.an.instanceof(GameRenderer);
            done();
        });
    });

    describe('init()', () => {
        it('should start the game renderer without a provided HTMLElement (that cannot be tested).', done => {
            testRenderer.init();
            expect(testRenderer.isStarted).to.be.true;
            done();
        });
    });

    describe('add()', () => {
        it('should add a Group object (like a Curling Stone) to its contained Scene.', done => {
            let testStone : CurlingStone = new CurlingStone();
            testRenderer.add(testStone);
            expect(testRenderer.scene.children).to.be.ok;
            done();
        });
    });
});
