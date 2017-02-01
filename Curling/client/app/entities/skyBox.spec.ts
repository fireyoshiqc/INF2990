/**
 * skyBox.spec.ts - Tests for the skybox
 *
 * @authors Félix Boulet et Yawen Hou
 * @date 2017/01/20
 */

import { SkyBox } from './skyBox';

import { expect } from 'chai';

describe('SkyBox', () => {

    describe('Default constructor ', () => {
        it('should construct a SkyBox object with default textures (no parameters passed).', done => {
            let testSkyBox: SkyBox;
            testSkyBox = new SkyBox();

            expect(testSkyBox).to.be.an.instanceof(SkyBox);
            expect(testSkyBox).to.be.an.instanceof(THREE.Mesh);
            expect(testSkyBox.imageName).to.equal("../assets/textures/sb_iceflow/iceflow_");
            expect(testSkyBox.directions).to.eql(["lf", "rt", "up", "dn", "ft", "bk"]);
            expect(testSkyBox.imageSuffix).to.equal(".jpg");
            done();
        });

        it('should construct a SkyBox object with imageName passed as parameter.', done => {
            let testSkyBox: SkyBox;
            testSkyBox = new SkyBox("icyhell/icyhell_");
            expect(testSkyBox.imageName).to.equal("../assets/textures/icyhell/icyhell_");
            done();
        });

        it('should construct a SkyBox object with imageName and directions passed as parameters.', done => {
            let testSkyBox: SkyBox;
            testSkyBox = new SkyBox("icyhell/icyhell_", ["lf", "rt", "up", "dn", "ft", "bk"]);
            expect(testSkyBox.imageName).to.equal("../assets/textures/icyhell/icyhell_");
            expect(testSkyBox.directions).to.eql(["lf", "rt", "up", "dn", "ft", "bk"]);
            done();
        });

        it('should construct a SkyBox object with imageName, directions and imageSuffix passed as parameters.',
            done => {
                let testSkyBox: SkyBox;
                testSkyBox = new SkyBox("dawnmountain-", ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"], ".png");
                expect(testSkyBox.imageName).to.equal("../assets/textures/dawnmountain-");
                expect(testSkyBox.directions).to.eql(["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"]);
                expect(testSkyBox.imageSuffix).to.equal(".png");
                done();
            });
    });
});
