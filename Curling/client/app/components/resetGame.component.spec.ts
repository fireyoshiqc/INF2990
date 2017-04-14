/**
 * resetGame.component.spec.ts
 *
 * @authors Pierre To
 * @date 2017/04/14
 */

import { expect } from 'chai';

import { ResetGameComponent, ResetGamePopupComponent } from './resetGame.component';

describe('ResetGameComponent', () => {

    let resetGameComponent = new ResetGameComponent(null);

    describe('Constructor', () => {
        it('should create the component', done => {
            expect(resetGameComponent).to.exist;
            expect(resetGameComponent).to.be.an.instanceOf(ResetGameComponent);
            done();
        });
    });
});

describe('ResetGamePopupComponent', () => {

    let resetGamePopupComponent = new ResetGamePopupComponent(null);

    describe('Constructor', () => {
        it('should create the component', done => {
            expect(resetGamePopupComponent).to.exist;
            expect(resetGamePopupComponent).to.be.an.instanceOf(ResetGamePopupComponent);
            done();
        });
    });
});
