import { AppComponent } from './app.component';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
// Un peu plus de recherche est nécessaire pour comprendre cette 
// ligne suivante
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { expect, assert } from 'chai'

class RouterStub {
  navigateByUrl(url: string) { return url; }
}

describe('AppComponent', function () {
  let de: DebugElement;
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ AppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('h1'));
  });

  it('should create component', () => expect(comp).to.not.be.undefined );

  it('should have expected <h1> text', () => {
    fixture.detectChanges();
    const h1 = de.nativeElement;
    expect(h1.innerText).to.match(/cube/i,
      '<h1> should say something about "a cube"');
  });
});