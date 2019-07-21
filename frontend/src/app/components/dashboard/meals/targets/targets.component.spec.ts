import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetsComponent } from './targets.component';
import { MockAddedFoodsService } from 'src/app/test-helpers/MockAddedFoodsService';
import { AddedFoodsService } from 'src/app/services/added-foods.service';
import { MockTranslateService } from 'src/app/test-helpers/MockTranslateService';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';

describe('TargetsComponent', () => {
  let component: TargetsComponent;
  let fixture: ComponentFixture<TargetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TargetsComponent, MockTranslatePipe],
      providers: [
        { provide: AddedFoodsService, useClass: MockAddedFoodsService },
        { provide: TranslateService, useClass: MockTranslateService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
