import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareMealPlansComponent } from './compare-meal-plans.component';

describe('CompareMealPlansComponent', () => {
  let component: CompareMealPlansComponent;
  let fixture: ComponentFixture<CompareMealPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareMealPlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareMealPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
