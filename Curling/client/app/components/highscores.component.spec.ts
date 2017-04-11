/**
 * highscores.component.spec.ts
 *
 * @authors Yawen Hou et Pierre To
 * @date 2017/04/10
 */

import { expect } from 'chai';

import { HighscoresComponent, HighscoresPopupComponent } from './highscores.component';

describe('HighscoresComponent', () => {

    let highscoresComponent = new HighscoresComponent(null);

    describe('Constructor', () => {
        it('should create the component', done => {
            expect(highscoresComponent).to.exist;
            expect(highscoresComponent).to.be.an.instanceOf(HighscoresComponent);
            expect(highscoresComponent.highscores).to.be.eql({ easy: [], hard: [] });
            expect(highscoresComponent.newScore).to.be.eql({ difficulty: 0, index: -1 });
            done();
        });
    });
});

describe('HighscoresPopupComponent', () => {

    let highscoresPopupComponent = new HighscoresPopupComponent(null);

    describe('Constructor', () => {
        it('should create the component', done => {
            expect(highscoresPopupComponent).to.exist;
            expect(highscoresPopupComponent).to.be.an.instanceOf(HighscoresPopupComponent);
            done();
        });
    });
});
