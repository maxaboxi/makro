import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMealsComponent } from './admin-meals.component';

describe('AdminMealsComponent', () => {
  let component: AdminMealsComponent;
  let fixture: ComponentFixture<AdminMealsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMealsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
