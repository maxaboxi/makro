import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedMealComponent } from './shared-meal.component';
import { LikeService } from 'src/app/services/like.service';
import { MockLikeService } from 'src/app/test-helpers/MockLikeService';
import { MockAddedFoodsService } from 'src/app/test-helpers/MockAddedFoodsService';
import { MockFoodService } from 'src/app/test-helpers/MockFoodService';
import { AddedFoodsService } from 'src/app/services/added-foods.service';
import { FoodService } from 'src/app/services/food.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';
import { ConnectionService } from 'src/app/services/connection.service';
import { MockTranslateService } from 'src/app/test-helpers/MockTranslateService';
import { MockConnectionService } from 'src/app/test-helpers/MockConnectionService';
import { MockFlashMessagesService } from 'src/app/test-helpers/MockFlashMessagesService';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SharedMealComponent', () => {
  let component: SharedMealComponent;
  let fixture: ComponentFixture<SharedMealComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SharedMealComponent, MockTranslatePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AddedFoodsService, useClass: MockAddedFoodsService },
        { provide: FoodService, useClass: MockFoodService },
        { provide: LikeService, useClass: MockLikeService },
        { provide: FlashMessagesService, useClass: MockFlashMessagesService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: ConnectionService, useClass: MockConnectionService }
      ],
      imports: [RouterTestingModule.withRoutes([])]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedMealComponent);
    component = fixture.componentInstance;
    component.meal = { name: 'meal', foods: [], userLike: 0 };
    fixture.detectChanges();
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
