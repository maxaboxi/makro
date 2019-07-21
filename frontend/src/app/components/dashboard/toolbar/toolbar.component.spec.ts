import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarComponent } from './toolbar.component';
import { AuthService } from 'src/app/services/auth.service';
import { MockAuthService } from 'src/app/test-helpers/MockAuthService';
import { MockAddedFoodsService } from 'src/app/test-helpers/MockAddedFoodsService';
import { MockFoodService } from 'src/app/test-helpers/MockFoodService';
import { MockDayService } from 'src/app/test-helpers/MockDayService';
import { MockFlashMessagesService } from 'src/app/test-helpers/MockFlashMessagesService';
import { MockTranslateService } from 'src/app/test-helpers/MockTranslateService';
import { MockSharedMealsService } from 'src/app/test-helpers/MockSharedMealsService';
import { MockConnectionService } from 'src/app/test-helpers/MockConnectionService';
import { MockStatisticsService } from 'src/app/test-helpers/MockStatisticsService';
import { StatisticsService } from 'src/app/services/statistics.service';
import { ConnectionService } from 'src/app/services/connection.service';
import { SharedMealsService } from 'src/app/services/shared-meals.service';
import { TranslateService } from '@ngx-translate/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { DayService } from 'src/app/services/day.service';
import { FoodService } from 'src/app/services/food.service';
import { AddedFoodsService } from 'src/app/services/added-foods.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';
import { FormsModule } from '@angular/forms';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToolbarComponent, MockTranslatePipe],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: AddedFoodsService, useClass: MockAddedFoodsService },
        { provide: FoodService, useClass: MockFoodService },
        { provide: DayService, useClass: MockDayService },
        { provide: FlashMessagesService, useClass: MockFlashMessagesService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: SharedMealsService, useClass: MockSharedMealsService },
        { provide: ConnectionService, useClass: MockConnectionService },
        { provide: StatisticsService, useClass: MockStatisticsService }
      ],
      imports: [NgbModule, FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
