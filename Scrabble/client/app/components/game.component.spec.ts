/**
 * game.component.spec.ts
 *
 * @authors Pierre To
 * @date 2017/02/21
 */

import { GameComponent } from './game.component';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { expect } from 'chai';

describe('GameComponent', function() {
    let comp: GameComponent;
    let fixture: ComponentFixture<GameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [GameComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GameComponent);
        comp = fixture.componentInstance;
    });

    it('should create component', () => {
        expect(comp).to.not.be.undefined;
        expect(comp).to.be.an.instanceOf(GameComponent);
    });
});
