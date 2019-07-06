import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareMealTableComponent } from './compare-meal-table.component';

describe('CompareMealTableComponent', () => {
  let component: CompareMealTableComponent;
  let fixture: ComponentFixture<CompareMealTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareMealTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareMealTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
