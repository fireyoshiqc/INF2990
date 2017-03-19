import { PlayerNameComponent } from './player-name.component';
//import { Player } from '../classes/player';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { expect } from 'chai';
describe('PlayerNameComponent', function() {
    let comp: PlayerNameComponent;
    let fixture: ComponentFixture<PlayerNameComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [PlayerNameComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayerNameComponent);
        comp = fixture.componentInstance;
    });
    it('should create component', () => {
        expect(comp).to.not.be.undefined;
    }
    );
    // A test that checks a synchronous value doesn't need a 'done' parameter
    it('player name should not be valid on init', () => {
        /* Since player is bound to an input, changes
           need to be  detected. Prior to this, comp.player
           is undefined */
        fixture.detectChanges();
        // Change the player name to be something
        comp.getPlayer().name = "";
        /* Since we directly modify the component property,
           no change detection is needed for a method */
        expect(comp.validatePlayerName()).to.be.false;
    });

    it('player name should be bound', () => {
        const expectedName = "Igor";

        fixture.detectChanges();
        /* We know that input is an input element, so it is safe
           to cast it as such, instead of a traditionnal HTMLElement */
        let name = <HTMLInputElement>fixture.debugElement
            .query(By.css('input')).nativeElement;
        name.value = expectedName;
        name.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(comp.getPlayer().name).to.equal(expectedName);
    });

});
