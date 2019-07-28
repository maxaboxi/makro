import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { Food } from '../models/Food';

@Injectable()
export class MockFoodService {
  public allFoods = new BehaviorSubject<Food[]>([{ name: 'food', energy: 10, protein: 2, carbs: 3, fat: 4, sugar: 1, fiber: 2 }]);
  constructor() {}

  public getAllFoods(): void {}
  public getFoodsAddedByUser() {
    return of([]);
  }
}
