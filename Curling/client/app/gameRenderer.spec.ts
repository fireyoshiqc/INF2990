import { GameRenderer } from './gameRenderer';
import { CurlingStone } from './curlingStone';

import { assert, expect } from 'chai';


describe('GameRenderer', () => {
    let testRenderer: GameRenderer;
    testRenderer = new GameRenderer();

    describe('Default constructor ', () => {
        it('should construct an empty GameRenderer object.', done => {
            testRenderer = new GameRenderer();
            expect(testRenderer).to.be.an.instanceof(GameRenderer);
            done();
        });
    });

    //testRenderer.init(new HTMLElement());


    // describe('init()', () => {
    //     it('should start the game renderer in the provided HTMLElement.', done => {
    //         let container: HTMLElement;
    //         testRenderer.init(container);
    //
    //
    //         done();
    //
    //
    //
    //     });
    //
    // });
    // describe('add()', () => {
    //   it('should add a Group object (like a Curling Stone) to its contained Scene.', done => {
    //     let testStone: CurlingStone = new CurlingStone();
    //     testRenderer.add(testStone);
    //     expect(testRenderer.scene.children).to.be.ok;
    //     done();
    //
    //
    //   });
    // });


});
