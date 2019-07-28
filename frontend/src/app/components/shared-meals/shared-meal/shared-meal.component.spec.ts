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
import { of } from 'rxjs';

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
    component.meal = {
      name: 'meal',
      foods: [{ name: 'abc', energy: 150, protein: 10, carbs: 2, fat: 44, sugar: 1, fiber: 2, amount: 122 }],
      userLike: 0,
      uuid: '123-abc',
      totalPoints: 0
    };
    fixture.detectChanges();
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate totals, set userlike and fetch foods', () => {
    // Arrange
    // Act
    // Assert
    expect(component.allFoods).toEqual([{ name: 'food', energy: 10, protein: 2, carbs: 3, fat: 4, sugar: 1, fiber: 2 }]);
    expect(component.loading).toBeFalsy();
    expect(component.proteinTotal).toBe(10);
    expect(component.carbTotal).toBe(2);
    expect(component.fatTotal).toBe(44);
    expect(component.amountTotal).toBe(122);
    expect(component.kcalTotal).toBe(150);
  });

  it('should set userlike and call likeservice likePost', () => {
    // Arrange
    component.user = { username: 'user', uuid: '123213', lang: 'fi', userAddedExpenditure: 1, dailyExpenditure: 1 };
    const spy1 = spyOn(TestBed.get(LikeService), 'likePost').and.returnValue(of({ success: true }));
    const spy2 = spyOn(TestBed.get(LikeService), 'replacePreviousLike');

    // Act
    component.like(1);

    // Arrange
    expect(spy2).not.toHaveBeenCalled();
    expect(spy1).toHaveBeenCalledWith({ userUUID: '123213', sharedMealUUID: '123-abc', value: 1 });
    expect(component.meal.totalPoints).toBe(1);
    expect(component.userLike).toBe(1);
  });

  it('should set userlike and call likeservice replacePreviousLike', () => {
    // Arrange
    component.user = { username: 'user', uuid: '123213', lang: 'fi', userAddedExpenditure: 1, dailyExpenditure: 1 };
    const spy1 = spyOn(TestBed.get(LikeService), 'likePost');
    const spy2 = spyOn(TestBed.get(LikeService), 'replacePreviousLike').and.returnValue(of({ success: true }));
    component.userLike = 1;
    component.meal.userLike = 1;
    component.meal.totalPoints = 1;

    // Act
    component.like(-1);

    // Arrange
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith({ userUUID: '123213', sharedMealUUID: '123-abc', value: -1 }, '123-abc');
    expect(component.meal.totalPoints).toBe(-1);
    expect(component.userLike).toBe(-1);
  });

  it('should add selected meal to user meals', () => {
    // Arrange
    localStorage.setItem('meals', JSON.stringify([{ name: 'meal1', foods: [] }, { name: 'meal2', foods: [] }]));
    component.selectedMeal = {
      name: 'meal',
      foods: [{ name: 'food', energy: 1, protein: 2, carbs: 2, fat: 1, fiber: 0, sugar: 0, amount: 200 }]
    };
    component.addToMeal = 'meal2';
    const expected = [
      { name: 'meal1', foods: [] },
      { name: 'meal2', foods: [{ name: 'food', energy: 1, protein: 2, carbs: 2, fat: 1, fiber: 0, sugar: 0, amount: 200 }] }
    ];
    const rSpy = spyOn(TestBed.get(Router), 'navigate');
    const aSpy = spyOn(TestBed.get(AddedFoodsService), 'setMealsFromLocalStorage');

    // Act
    component.addMeal();

    // Assert
    expect(JSON.parse(localStorage.getItem('meals'))).toEqual(expected);
    expect(rSpy).toHaveBeenCalled();
    expect(aSpy).toHaveBeenCalled();
    expect(component.selectedMeal).toBe(undefined);
    expect(component.amountTotal).toBe(0);
    expect(component.kcalTotal).toBe(0);
    expect(component.proteinTotal).toBe(0);
    expect(component.carbTotal).toBe(0);
    expect(component.fatTotal).toBe(0);
    expect(component.amountToAddPortions).toBe(0);
    expect(component.amountToAddGrams).toBe(0);
  });

  it('should add selected meal to user meals with portions', () => {
    // Arrange
    localStorage.setItem('meals', JSON.stringify([{ name: 'meal1', foods: [] }, { name: 'meal2', foods: [] }]));
    component.selectedMeal = {
      name: 'meal',
      foods: [{ name: 'food', energy: 10, protein: 20, carbs: 20, fat: 10, fiber: 0, sugar: 0, amount: 200 }],
      portions: 2
    };
    component.addToMeal = 'meal2';
    const expected = [
      { name: 'meal1', foods: [] },
      { name: 'meal2', foods: [{ name: 'food', energy: 5, protein: 10, carbs: 10, fat: 5, fiber: 0, sugar: 0, amount: 100 }] }
    ];
    const rSpy = spyOn(TestBed.get(Router), 'navigate');
    const aSpy = spyOn(TestBed.get(AddedFoodsService), 'setMealsFromLocalStorage');
    component.amountToAddPortions = 1;

    // Act
    component.addMeal();

    // Assert
    expect(JSON.parse(localStorage.getItem('meals'))).toEqual(expected);
    expect(rSpy).toHaveBeenCalled();
    expect(aSpy).toHaveBeenCalled();
    expect(component.selectedMeal).toBe(undefined);
    expect(component.amountTotal).toBe(0);
    expect(component.kcalTotal).toBe(0);
    expect(component.proteinTotal).toBe(0);
    expect(component.carbTotal).toBe(0);
    expect(component.fatTotal).toBe(0);
    expect(component.amountToAddPortions).toBe(0);
    expect(component.amountToAddGrams).toBe(0);
  });

  it('should add selected meal to user meals with grams', () => {
    // Arrange
    localStorage.setItem('meals', JSON.stringify([{ name: 'meal1', foods: [] }, { name: 'meal2', foods: [] }]));
    component.selectedMeal = {
      name: 'meal',
      foods: [{ name: 'food', energy: 10, protein: 20, carbs: 20, fat: 10, fiber: 0, sugar: 0, amount: 100 }]
    };
    component.addToMeal = 'meal2';
    const expected = [
      { name: 'meal1', foods: [] },
      { name: 'meal2', foods: [{ name: 'food', energy: 5, protein: 10, carbs: 10, fat: 5, fiber: 0, sugar: 0, amount: 50 }] }
    ];
    const rSpy = spyOn(TestBed.get(Router), 'navigate');
    const aSpy = spyOn(TestBed.get(AddedFoodsService), 'setMealsFromLocalStorage');
    component.amountToAddGrams = 50;
    component.amountTotal = 100;
    component.allFoods = [{ name: 'food', energy: 10, protein: 20, carbs: 20, fat: 10, fiber: 0, sugar: 0, amount: 100 }];

    // Act
    component.addMeal();

    // Assert
    expect(JSON.parse(localStorage.getItem('meals'))).toEqual(expected);
    expect(rSpy).toHaveBeenCalled();
    expect(aSpy).toHaveBeenCalled();
    expect(component.selectedMeal).toBe(undefined);
    expect(component.amountTotal).toBe(0);
    expect(component.kcalTotal).toBe(0);
    expect(component.proteinTotal).toBe(0);
    expect(component.carbTotal).toBe(0);
    expect(component.fatTotal).toBe(0);
    expect(component.amountToAddPortions).toBe(0);
    expect(component.amountToAddGrams).toBe(0);
  });
});
