import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareTotalsComponent } from './compare-totals.component';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';

describe('CompareTotalsComponent', () => {
  let component: CompareTotalsComponent;
  let fixture: ComponentFixture<CompareTotalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompareTotalsComponent, MockTranslatePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareTotalsComponent);
    component = fixture.componentInstance;
    component.totals = { energy: 0, protein: 0, carb: 0, fat: 0, fiber: 0, sugar: 0, amount: 0 };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
