/**
 * highscores.service.spec.ts - Tests for highscores service (only the constructor)
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/04/10
 */

import { HighscoresService } from './highscores.service';
import { expect } from 'chai';

describe('HighscoresService', () => {

    let highscoresService: HighscoresService;

    describe('constructor()', () => {
        it('should construct a HighscoresService from an HTTP object', done => {
            highscoresService = new HighscoresService(null);
            expect(highscoresService).to.exist;
            expect(highscoresService).to.be.an.instanceof(HighscoresService);
            done();
        });
    });
});
