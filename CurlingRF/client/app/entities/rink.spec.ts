/**
 * rink.spec.ts - Tests for the rink
 *
 * @authors Félix Boulet, Mikaël Ferland
 * @date 2017/04/01
 */

import { Rink } from './rink';
import { SkyBox } from './skyBox';

import { expect } from 'chai';

describe('Rink', () => {

    let testRink = new Rink();
    let envMap = new SkyBox();

    describe('init()', () => {
        it('should initialize the rink and give it all its dimensions and textures.', done => {
            testRink.init(envMap.getSkyBoxImages()).then((rink) => {
                expect(rink).to.exist;
                expect(rink.getReflectTexture()).to.exist;
                expect(rink.getWhiteIceTexture()).to.exist;
                expect(rink.getClippingPlanes()).to.exist;
                done();
            });
        });
    });
});
