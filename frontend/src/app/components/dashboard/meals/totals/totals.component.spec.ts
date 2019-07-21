import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalsComponent } from './totals.component';
import { MockAddedFoodsService } from 'src/app/test-helpers/MockAddedFoodsService';
import { AddedFoodsService } from 'src/app/services/added-foods.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';

describe('TotalsComponent', () => {
  let component: TotalsComponent;
  let fixture: ComponentFixture<TotalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TotalsComponent, MockTranslatePipe],
      providers: [{ provide: AddedFoodsService, useClass: MockAddedFoodsService }],
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
