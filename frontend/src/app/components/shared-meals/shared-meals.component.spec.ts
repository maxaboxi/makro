import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedMealsComponent } from './shared-meals.component';
import { MockAuthService } from 'src/app/test-helpers/MockAuthService';
import { AuthService } from 'src/app/services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';
import { SharedMealsService } from 'src/app/services/shared-meals.service';
import { ConnectionService } from 'src/app/services/connection.service';
import { MockConnectionService } from 'src/app/test-helpers/MockConnectionService';
import { MockSharedMealsService } from 'src/app/test-helpers/MockSharedMealsService';
import { MockTranslateService } from 'src/app/test-helpers/MockTranslateService';
import { MockFlashMessagesService } from 'src/app/test-helpers/MockFlashMessagesService';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';
import { of } from 'rxjs';
import { Meal } from 'src/app/models/Meal';

describe('SharedMealsComponent', () => {
  let component: SharedMealsComponent;
  let fixture: ComponentFixture<SharedMealsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SharedMealsComponent, MockTranslatePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: FlashMessagesService, useClass: MockFlashMessagesService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: SharedMealsService, useClass: MockSharedMealsService },
        { provide: ConnectionService, useClass: MockConnectionService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedMealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user and fetch all sharedmeals', () => {
    // Arrange
    const user = { username: 'user', uuid: '123213', lang: 'fi', userAddedExpenditure: 1, dailyExpenditure: 1 };
    const meals: Meal[] = [{ name: 'abcd', foods: [] }, { name: 'dcba', foods: [] }];
    const mSpy = spyOn(TestBed.get(SharedMealsService), 'getAllMeals').and.returnValue(of(meals));

    // Act
    component.ngOnInit();

    // Assert
    expect(component.user).toEqual(user);
    expect(mSpy).toHaveBeenCalledTimes(1);
    expect(component.loading).toBeFalsy();
    expect(component.allMeals).toEqual([{ name: 'abcd', foods: [] }, { name: 'dcba', foods: [] }]);
    expect(component.sharedMealsFirst).toEqual([{ name: 'abcd', foods: [] }]);
    expect(component.sharedMealsSecond).toEqual([{ name: 'dcba', foods: [] }]);
  });

  searchMeals('ffff', []);
  searchMeals('me', [
    { name: 'me', foods: [], info: 'xx', addedByName: 'user1', tags: ['tag1'] },
    { name: 'meal', foods: [], info: 'xx', addedByName: 'user2', tags: ['tag2'] }
  ]);
  searchMeals('tag1', [
    { name: 'me', foods: [], info: 'xx', addedByName: 'user1', tags: ['tag1'] },
    { name: 'a', foods: [], info: 'zz', addedByName: 'user2', tags: ['tag1'] }
  ]);
  searchMeals('user1', [
    { name: 'me', foods: [], info: 'xx', addedByName: 'user1', tags: ['tag1'] },
    { name: 'b', foods: [], info: 'zz', addedByName: 'user1', tags: ['tag2'] }
  ]);
  searchMeals('zz', [
    { name: 'a', foods: [], info: 'zz', addedByName: 'user2', tags: ['tag1'] },
    { name: 'b', foods: [], info: 'zz', addedByName: 'user1', tags: ['tag2'] }
  ]);
  function searchMeals(searchTerm: string, expectedResults: Meal[]) {
    it('should search for meals', () => {
      // Arrange
      component.searchTerm = searchTerm;
      component.allMeals = [
        { name: 'me', foods: [], info: 'xx', addedByName: 'user1', tags: ['tag1'] },
        { name: 'a', foods: [], info: 'zz', addedByName: 'user2', tags: ['tag1'] },
        { name: 'b', foods: [], info: 'zz', addedByName: 'user1', tags: ['tag2'] },
        { name: 'meal', foods: [], info: 'xx', addedByName: 'user2', tags: ['tag2'] }
      ];

      // Act
      component.searchMeals();

      // Assert
      expect(component.results).toEqual(expectedResults);
    });
  }
});
