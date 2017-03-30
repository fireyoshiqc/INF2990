/**
 * rack.component.spec.ts
 *
 * @authors Pierre To
 * @date 2017/02/21
 */

import { RackComponent } from './rack.component';

import { expect } from 'chai';

describe('RackComponent', () => {
    let comp = new RackComponent(null);

    it('should create component', done => {
        expect(comp).to.exist;
        expect(comp).to.be.an.instanceOf(RackComponent);
        done();
    });
});
