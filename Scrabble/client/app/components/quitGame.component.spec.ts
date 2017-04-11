/**
 * quitGame.component.spec.ts
 *
 * @authors Pierre To
 * @date 2017/04/10
 */

import { expect } from 'chai';

import { QuitGameComponent, QuitGamePopupComponent } from './quitGame.component';

describe('QuitGameComponent', () => {

    let quitGameComponent = new QuitGameComponent(null);

    describe('Constructor', () => {
        it('should create the component', done => {
            expect(quitGameComponent).to.exist;
            expect(quitGameComponent).to.be.an.instanceOf(QuitGameComponent);
            done();
        });
    });
});

describe('QuitGamePopupComponent', () => {

    let quitGamePopupComponent = new QuitGamePopupComponent(null);

    describe('Constructor', () => {
        it('should create the component', done => {
            expect(quitGamePopupComponent).to.exist;
            expect(quitGamePopupComponent).to.be.an.instanceOf(QuitGamePopupComponent);
            done();
        });
    });
});
