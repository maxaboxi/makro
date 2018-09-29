import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDaysComponent } from './shared-days.component';

describe('SharedDaysComponent', () => {
  let component: SharedDaysComponent;
  let fixture: ComponentFixture<SharedDaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedDaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
