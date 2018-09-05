import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MealTableComponent } from './meal-table.component';

describe('MealTableComponent', () => {
  let component: MealTableComponent;
  let fixture: ComponentFixture<MealTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MealTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MealTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
