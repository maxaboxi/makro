import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { Food } from '../models/Food';

@Injectable()
export class MockFoodService {
  public allFoods = new BehaviorSubject<Food[]>([]);
  constructor() {}

  public getAllFoods(): void {}
  public getFoodsAddedByUser() {
    return of([]);
  }
}
