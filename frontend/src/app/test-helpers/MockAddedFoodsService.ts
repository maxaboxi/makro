import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Meal } from '../models/Meal';
import { Totals } from '../models/Totals';

@Injectable()
export class MockAddedFoodsService {
  public _showTargets = new BehaviorSubject<boolean>(true);
  public _meals = new BehaviorSubject<Meal[]>([]);
  public _openedSavedMeal = new BehaviorSubject<boolean>(false);
  public _mealsEdited = new BehaviorSubject<boolean>(false);
  public _previousMealsSavedToLocalStorage = new BehaviorSubject<boolean>(false);
  public _targets = new BehaviorSubject<any>({
    userAddedExpenditure: 1,
    userAddedProteinTarget: 1,
    userAddedCarbTarget: 1,
    userAddedFatTarget: 1,
    dailyExpenditure: 1,
    proteinTarget: 1,
    carbTarget: 1,
    fatTarget: 1
  });
  public _totals = new BehaviorSubject<Totals>({ energy: 0, protein: 0, carb: 0, fat: 0, fiber: 0, sugar: 0, amount: 0 });
  constructor() {}
  public setMealsFromLocalStorage(): void {}
  public getMeals() {
    return [];
  }
}
