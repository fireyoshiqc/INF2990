/**
 * fastIce.spec.ts - Tests for the FastIce spots
 *
 * @authors Félix Boulet, Mikaël Ferland
 * @date 2017/04/01
 */

import { FastIce } from './fastIce';

import { expect } from 'chai';

describe('FastIce', () => {

    let testFastIce = new FastIce();

    describe('init()', () => {
        it('should initialize the FastIce spot.', done => {
            testFastIce.init()
                .then((fastIce) => {
                    expect(fastIce).to.exist;
                    expect(fastIce.children[0]).to.exist;
                    done();
                });
        });
    });

    describe('fadeOut()', () => {
        it('should change the ice spot material properties.', done => {
            let material = (<THREE.Mesh>testFastIce.children[0]).material as THREE.MeshStandardMaterial;
            expect(testFastIce.fadeOut(1 / 60)).to.eql(false, "FastIce spots need one second to fade out");
            expect(material.metalness).to.be.below(0.8);
            expect(material.roughness).to.be.above(0.0);
            done();
        });

        it('should completely fade the spot in one second.', done => {
            let material = (<THREE.Mesh>testFastIce.children[0]).material as THREE.MeshStandardMaterial;
            expect(testFastIce.fadeOut(60 / 60)).to.eql(true, "FastIce spots need one second to fade out");
            expect(material.metalness).to.be.below(0.6);
            expect(material.roughness).to.be.above(0.2);
            done();
        });
    });
});
