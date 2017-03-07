/**
 * rack.component.spec.ts
 *
 * @authors Pierre To
 * @date 2017/02/21
 */

import { RackComponent } from './rack.component';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { expect } from 'chai';

describe('RackComponent', function() {
    let comp: RackComponent;
    let fixture: ComponentFixture<RackComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [RackComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RackComponent);
        comp = fixture.componentInstance;
    });

    it('should create component', done => {
        expect(comp).to.not.be.undefined;
        expect(comp).to.be.an.instanceOf(RackComponent);
        done();
    });
});
