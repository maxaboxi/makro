import { Injectable } from '@angular/core';
import { Meal } from '../models/Meal';
import { BehaviorSubject } from 'rxjs';
import { Food } from '../models/Food';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AddedFoodsService {
  _meals = new BehaviorSubject<Meal[]>([]);
  _totals = new BehaviorSubject<any>({
    energy: 0,
    protein: 0,
    carb: 0,
    fat: 0
  });
  _targets = new BehaviorSubject<any>(null);

  constructor() {}

  setMealsFromLocalStorage() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    this._meals.next(user.meals);
    this.setTargets(user);
  }

  setTargets(user: User) {
    const targets = {
      dailyExpenditure: user.dailyExpenditure,
      userAddedExpenditure: user.userAddedExpenditure,
      userAddedCarbTarget: user.userAddedCarbTarget,
      userAddedFatTarget: user.userAddedFatTarget,
      userAddedProteinTarget: user.userAddedProteinTarget
    };
    this._targets.next(targets);
  }

  setMeals(meals: Meal[]) {
    this._meals.next(meals);
  }

  getMeals() {
    return this._meals.getValue();
  }

  addFoodToMeals(e) {
    if (this._meals.getValue().length === 0) {
      this.setMealsFromLocalStorage();
    }
    if (e.food) {
      const food: Food = {
        name: e.food.name,
        energia: e.food.energia * (e.amount / 100),
        proteiini: e.food.proteiini * (e.amount / 100),
        hh: e.food.hh * (e.amount / 100),
        rasva: e.food.rasva * (e.amount / 100),
        kuitu: e.food.kuitu * (e.amount / 100),
        sokeri: e.food.sokeri * (e.amount / 100),
        amount: e.amount
      };
      const t = this._totals.getValue();
      t.energy += food.energia;
      t.protein += food.proteiini;
      t.carb += food.hh;
      t.fat += food.rasva;
      this._totals.next(t);
      this._meals.getValue().forEach(m => {
        if (m.name === e.meal) {
          m.foods.push(food);
        }
      });
    }
  }
}
