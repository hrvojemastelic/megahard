/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SideCalcComponent } from './side-calc.component';

describe('SideCalcComponent', () => {
  let component: SideCalcComponent;
  let fixture: ComponentFixture<SideCalcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideCalcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
