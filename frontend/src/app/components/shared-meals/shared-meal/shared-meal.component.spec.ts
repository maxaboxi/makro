import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedMealComponent } from './shared-meal.component';

describe('SharedMealComponent', () => {
  let component: SharedMealComponent;
  let fixture: ComponentFixture<SharedMealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedMealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedMealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
