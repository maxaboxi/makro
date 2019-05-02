import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTrackedPeriodsComponent } from './admin-tracked-periods.component';

describe('AdminTrackedPeriodsComponent', () => {
  let component: AdminTrackedPeriodsComponent;
  let fixture: ComponentFixture<AdminTrackedPeriodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTrackedPeriodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTrackedPeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
