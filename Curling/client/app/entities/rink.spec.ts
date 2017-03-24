/**
 * rink.spec.ts - Tests for the rink
 *
 * @authors Félix Boulet et Yawen Hou
 * @date 2017/01/20
 */

import { Rink } from './rink';

import { expect } from 'chai';

describe('Rink', () => {
    describe('Default constructor ', () => {
        it('should construct a Rink object with string table passed in parameter.', done => {
            let path = "../assets/textures/sb_iceflow/iceflow_";
            let suffix = ".jpg";
            let imagesTable: Array<string> = [path + "lf" + suffix, path + "rt" +
                suffix, path + "up" + suffix, path + "dn" + suffix, path + "ft" + suffix, path + "bk"];
            let testRink = new Rink(imagesTable, null);
            expect(testRink).to.exist;
            expect(testRink).to.be.an.instanceof(Rink);
            expect(testRink).to.be.an.instanceof(THREE.Group);
            done();
        });
    });
});
