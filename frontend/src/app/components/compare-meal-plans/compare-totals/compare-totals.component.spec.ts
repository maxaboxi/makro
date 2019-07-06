import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareTotalsComponent } from './compare-totals.component';

describe('CompareTotalsComponent', () => {
  let component: CompareTotalsComponent;
  let fixture: ComponentFixture<CompareTotalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareTotalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
