import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyLocatorComponent } from './property-locator.component';

describe('PropertyLocatorComponent', () => {
  let component: PropertyLocatorComponent;
  let fixture: ComponentFixture<PropertyLocatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyLocatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyLocatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
