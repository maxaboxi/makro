import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareMealPlansComponent } from './compare-meal-plans.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MockAuthService } from 'src/app/test-helpers/MockAuthService';
import { MockAddedFoodsService } from 'src/app/test-helpers/MockAddedFoodsService';
import { MockFoodService } from 'src/app/test-helpers/MockFoodService';
import { MockDayService } from 'src/app/test-helpers/MockDayService';
import { DayService } from 'src/app/services/day.service';
import { FoodService } from 'src/app/services/food.service';
import { AddedFoodsService } from 'src/app/services/added-foods.service';
import { MockTranslateService } from 'src/app/test-helpers/MockTranslateService';
import { MockFlashMessagesService } from 'src/app/test-helpers/MockFlashMessagesService';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';
import { SharedMealsService } from 'src/app/services/shared-meals.service';
import { MockSharedMealsService } from 'src/app/test-helpers/MockSharedMealsService';
import { ConnectionService } from 'src/app/services/connection.service';
import { MockConnectionService } from 'src/app/test-helpers/MockConnectionService';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';

describe('CompareMealPlansComponent', () => {
  let component: CompareMealPlansComponent;
  let fixture: ComponentFixture<CompareMealPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompareMealPlansComponent, MockTranslatePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: AddedFoodsService, useClass: MockAddedFoodsService },
        { provide: FoodService, useClass: MockFoodService },
        { provide: DayService, useClass: MockDayService },
        { provide: FlashMessagesService, useClass: MockFlashMessagesService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: SharedMealsService, useClass: MockSharedMealsService },
        { provide: ConnectionService, useClass: MockConnectionService }
      ]
    }).compileComponents();
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
