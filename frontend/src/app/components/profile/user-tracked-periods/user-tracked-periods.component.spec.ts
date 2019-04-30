import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTrackedPeriodsComponent } from './user-tracked-periods.component';

describe('UserTrackedPeriodsComponent', () => {
  let component: UserTrackedPeriodsComponent;
  let fixture: ComponentFixture<UserTrackedPeriodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTrackedPeriodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTrackedPeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
