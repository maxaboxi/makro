import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class MockSharedMealsService {
  constructor() {}

  public getMealsByUser() {
    return of([]);
  }

  public getAllMeals() {
    return of([]);
  }
}
