/**
 * gl.component.spec.ts
 *
 * @authors Pierre To, Mikaël Ferland
 * @date 2017/02/28
 */

import { GlComponent } from './gl.component';
import { GameController } from '../services/gameController.service';

import { expect } from 'chai';

describe('GlComponent', () => {

    let gameController = new GameController();
    let glComponent = new GlComponent(null, gameController);

    describe('Default constructor ', () => {
        it('should construct the GlComponent.', done => {
            expect(glComponent).to.not.be.undefined;
            expect(glComponent).to.be.an.instanceof(GlComponent);
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
