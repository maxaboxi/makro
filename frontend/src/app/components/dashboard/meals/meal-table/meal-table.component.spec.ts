import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MealTableComponent } from './meal-table.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MockAddedFoodsService } from 'src/app/test-helpers/MockAddedFoodsService';
import { MockFlashMessagesService } from 'src/app/test-helpers/MockFlashMessagesService';
import { MockTranslateService } from 'src/app/test-helpers/MockTranslateService';
import { MockSharedMealsService } from 'src/app/test-helpers/MockSharedMealsService';
import { SharedMealsService } from 'src/app/services/shared-meals.service';
import { TranslateService } from '@ngx-translate/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AddedFoodsService } from 'src/app/services/added-foods.service';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';
import { FormsModule } from '@angular/forms';

describe('MealTableComponent', () => {
  let component: MealTableComponent;
  let fixture: ComponentFixture<MealTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MealTableComponent, MockTranslatePipe],
      providers: [
        { provide: AddedFoodsService, useClass: MockAddedFoodsService },
        { provide: FlashMessagesService, useClass: MockFlashMessagesService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: SharedMealsService, userClass: MockSharedMealsService }
      ],
      imports: [NgbModule, FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MealTableComponent);
    component = fixture.componentInstance;
    component.meal = { name: 'meal', foods: [] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
