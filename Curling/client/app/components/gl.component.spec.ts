/**
 * gameController.service.spec.ts
 *
 * @authors Vincent Chassé et Erica Bugden
 * @date 2017/03/31
 */

import { expect } from 'chai';

import { GlComponent } from './gl.component';
import { GameController } from '../services/gameController.service';
import { HighscoresService } from '../services/highscores.service';
import { Http } from '@angular/http';

describe('GlComponentr', () => {

    let gameController = new GameController();
    let http: Http;
    let highscoresService = new HighscoresService(http);
    let glComponent = new GlComponent(null, gameController, highscoresService);

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
