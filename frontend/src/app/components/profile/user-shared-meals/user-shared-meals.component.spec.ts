import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSharedMealsComponent } from './user-shared-meals.component';

describe('SharedMealsComponent', () => {
  let component: UserSharedMealsComponent;
  let fixture: ComponentFixture<UserSharedMealsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserSharedMealsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSharedMealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
