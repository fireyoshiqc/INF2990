/**
 * info.component.spec.ts
 *
 * @authors Pierre To
 * @date 2017/02/21
 */

import { InfoComponent } from './info.component';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { expect } from 'chai';

describe('InfoComponent', function () {
    let comp: InfoComponent;
    let fixture: ComponentFixture<InfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [InfoComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InfoComponent);
        comp = fixture.componentInstance;
    });

    it('should create component', () => {
        expect(comp).to.not.be.undefined;
        expect(comp).to.be.an.instanceOf(InfoComponent);
    });
});

describe('updateInfo()', () => {
    it('should update the timer and the active player', done => {
        let testInfoComp = new InfoComponent();
        let testTurnInfo = { minutes: 2, seconds: 50, activePlayerName: "Erica" };

        testInfoComp.updateTurnInfo(testTurnInfo);

        expect(testInfoComp.getTurnInfo().minutes).to.be.equal(2);
        expect(testInfoComp.getTurnInfo().seconds).to.be.equal(50);
        expect(testInfoComp.getTurnInfo().activePlayerName).to.be.equal("Erica");
        done();
    });
});
