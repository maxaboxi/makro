import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSharedMealsComponent } from './user-shared-meals.component';
import { MockFlashMessagesService } from 'src/app/test-helpers/MockFlashMessagesService';
import { MockTranslateService } from 'src/app/test-helpers/MockTranslateService';
import { MockAuthService } from 'src/app/test-helpers/MockAuthService';
import { MockSharedMealsService } from 'src/app/test-helpers/MockSharedMealsService';
import { SharedMealsService } from 'src/app/services/shared-meals.service';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FoodService } from 'src/app/services/food.service';
import { MockFoodService } from 'src/app/test-helpers/MockFoodService';
import { MockAddedFoodsService } from 'src/app/test-helpers/MockAddedFoodsService';
import { AddedFoodsService } from 'src/app/services/added-foods.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

describe('SharedMealsComponent', () => {
  let component: UserSharedMealsComponent;
  let fixture: ComponentFixture<UserSharedMealsComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserSharedMealsComponent, MockTranslatePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: FlashMessagesService, useClass: MockFlashMessagesService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: SharedMealsService, useClass: MockSharedMealsService },
        { provide: FoodService, useClass: MockFoodService },
        { provide: AddedFoodsService, useClass: MockAddedFoodsService }
      ],
      imports: [NgbModule, RouterTestingModule.withRoutes([]), FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSharedMealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
