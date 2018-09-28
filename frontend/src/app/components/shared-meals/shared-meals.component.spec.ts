import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedMealsComponent } from './shared-meals.component';

describe('SharedMealsComponent', () => {
  let component: SharedMealsComponent;
  let fixture: ComponentFixture<SharedMealsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedMealsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedMealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
