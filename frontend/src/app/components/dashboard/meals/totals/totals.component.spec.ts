import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalsComponent } from './totals.component';
import { MockAddedFoodsService } from 'src/app/test-helpers/MockAddedFoodsService';
import { AddedFoodsService } from 'src/app/services/added-foods.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';
import { DayService } from 'src/app/services/day.service';
import { MockDayService } from 'src/app/test-helpers/MockDayService';

describe('TotalsComponent', () => {
  let component: TotalsComponent;
  let fixture: ComponentFixture<TotalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TotalsComponent, MockTranslatePipe],
      providers: [{ provide: AddedFoodsService, useClass: MockAddedFoodsService }, { provide: DayService, useClass: MockDayService }],
      imports: [NgbModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
