/**
 * textureCacher.ts - Tests for module to accelerate texture loading and caching.
 *
 * @authors Félix Boulet
 * @date 2017/02/18
 */
import { TextureCacher } from './textureCacher';
import { expect } from 'chai';

describe('TextureCacher', () => {

    describe('load()', () => {
        it("should load a given texture and add it to the cache if it's not there yet.", done => {
            let texture = TextureCacher.load('/assets/textures/granite.jpg');
            expect(texture).to.be.an.instanceof(THREE.Texture);
            expect(TextureCacher.getTexture('/assets/textures/granite.jpg')).to.exist;
            done();
        });
        it("should return a given texture if it's already in the cache.", done => {
            let texture = TextureCacher.load('/assets/textures/granite.jpg');
            expect(texture).to.be.an.instanceof(THREE.Texture);
            expect(TextureCacher.getTexture('/assets/textures/granite.jpg')).to.exist;
            done();
        });
    });

    describe('getTexture()', () => {
        it("should return undefined if the texture is not in the cache.", done => {
            expect(TextureCacher.getTexture('/assets/textures/test.jpg')).to.be.undefined;
            done();
        });
        it("should return the texture if it is in the cache.", done => {
            TextureCacher.load('/assets/textures/granite.jpg');
            expect(TextureCacher.getTexture('/assets/textures/granite.jpg')).to.be.an.instanceof(THREE.Texture);
            done();
        });

    });

    describe('discard()', () => {
        it("should remove a given texture from the cache.", done => {
            TextureCacher.discard('/assets/textures/granite.jpg');
            expect(TextureCacher.getTexture('/assets/textures/test.jpg')).to.be.undefined;
            done();
        });
        it("should do nothing if the given texture is not in the cache.", done => {
            TextureCacher.discard('/assets/textures/granite.jpg');
            expect(TextureCacher.getTexture('/assets/textures/test.jpg')).to.be.undefined;
            done();
        });
    });

    describe('clear()', () => {
        it("should empty the texture cache.", done => {
            TextureCacher.load('/assets/textures/granite.jpg');
            TextureCacher.clear();
            expect(TextureCacher.getTexture('/assets/textures/test.jpg')).to.be.undefined;
            done();
        });
    });
});
