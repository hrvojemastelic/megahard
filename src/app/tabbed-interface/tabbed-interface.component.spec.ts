import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabbedInterfaceComponent } from './tabbed-interface.component';

describe('TabbedInterfaceComponent', () => {
  let component: TabbedInterfaceComponent;
  let fixture: ComponentFixture<TabbedInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabbedInterfaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabbedInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
