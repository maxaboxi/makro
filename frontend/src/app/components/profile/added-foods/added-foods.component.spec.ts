import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddedFoodsComponent } from './added-foods.component';

describe('AddedFoodsComponent', () => {
  let component: AddedFoodsComponent;
  let fixture: ComponentFixture<AddedFoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddedFoodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddedFoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
