/**
 * textureCacher.ts - Utility module to accelerate texture loading and caching.
 *
 * @authors Félix Boulet
 * @date 2017/02/11
 */

export module TextureCacher {

    let texLoader = new THREE.TextureLoader();
    let texCache: THREE.Texture[] = [];

    export function load(path: string) {

        if (texCache[path] === undefined) {
            texCache[path] = texLoader.load(path);
        }
        return texCache[path];
    }

    // Used for tests
    export function getTexture(path: string): THREE.Texture {
        return texCache[path];
    }

    export function discard(path: string) {
        if (texCache[path] !== undefined) {
            delete texCache[path];
        }
    }

    export function clear() {
        texCache = [];
    }
}
