/**
 * hud.component.spec.ts
 *
 * @authors Pierre To, Mikaël Ferland
 * @date 2017/02/28
 */

import { HUDComponent } from './hud.component';

import { expect } from 'chai';

describe('HUDComponent', () => {

    let hudComponent = new HUDComponent();

    describe('Default constructor ', () => {
        it('should construct the HUDComponent.', done => {
            expect(hudComponent).to.not.be.undefined;
            expect(hudComponent).to.be.an.instanceof(HUDComponent);
            done();
        });
    });

    describe('toggleTheme()', () => {
        it('should toggle the theme.', done => {
            expect(hudComponent.getTheme()).to.be.false;
            hudComponent.toggleTheme();
            expect(hudComponent.getTheme()).to.be.true;
            done();
        });
    });
});
