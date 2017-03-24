/**
 * lightManager.spec.ts - Tests for the light manager
 *
 * @authors Félix Boulet et Yawen Hou
 * @date 2017/01/27
 */

import { LightManager } from './lightManager';
import { Rink } from '../entities/rink';
import { SkyBox } from '../entities/skyBox';

import { expect } from 'chai';

describe('LightManager', () => {

    let testManager : LightManager = new LightManager();

    describe('Default constructor ', () => {
        it('should construct an empty LightManager object.', done => {
            expect(testManager).to.exist;
            expect(testManager).to.be.an.instanceof(LightManager);
            done();
        });
    });

    describe('spawnSpotlights()', () => {
        it('should spawn an array of spotlights.', done => {
            let spotlights : THREE.Group;
            spotlights = testManager.spawnSpotlights(0, 0, 0, new Rink(new SkyBox().skyBoxImages));
            expect(spotlights).to.be.an.instanceof(THREE.Group);
            done();
        });

        it('should spawn the array at the specified position.', done => {
            let spotlights : THREE.Group;
            spotlights = testManager.spawnSpotlights(1, 2, 3, new Rink(new SkyBox().skyBoxImages));
            expect(spotlights.position.x).to.equal(1);
            expect(spotlights.position.y).to.equal(2);
            expect(spotlights.position.z).to.equal(3);
            done();
        });
    });

    describe('spawnAmbientLight()', () => {
        it('should spawn an HemisphereLight.', done => {
            let ambientLight : THREE.HemisphereLight;
            ambientLight = testManager.spawnAmbientLight(0xffffff, 0x000000);
            expect(ambientLight).to.be.an.instanceof(THREE.HemisphereLight);
            done();
        });

        it('should give the specified colors to the ambient light.', done => {
            let ambientLight : THREE.HemisphereLight;
            ambientLight = testManager.spawnAmbientLight(0xffffff, 0x000000);
            expect(ambientLight.color.equals(new THREE.Color(0xffffff))).to.be.true;
            expect(ambientLight.groundColor.equals(new THREE.Color(0x000000))).to.be.true;
            done();
        });
    });
});
