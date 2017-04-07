/**
 * gameController.service.spec.ts
 *
 * @authors Vincent Chassé et Erica Bugden
 * @date 2017/03/31
 */

import { expect } from 'chai';

import { GlComponent } from './gl.component';
import { GameController } from '../services/gameController.service';

describe('GlComponentr', () => {

    let gameController = new GameController(null, null);
    let glComponent = new GlComponent(null, gameController);

    describe('Constructor', () => {
        it('should create the component', done => {
            expect(glComponent).to.exist;
            done();
        });
    });

    describe('toggleTheme()', () => {
        it('should toggle the theme.', done => {
            expect(glComponent.getTheme()).to.be.false;
            glComponent.toggleTheme();
            expect(glComponent.getTheme()).to.be.true;
            done();
        });
    });
});
