import { Injectable } from '@angular/core';
import { Meal } from '../models/Meal';
import { BehaviorSubject } from 'rxjs';
import { Food } from '../models/Food';
import { User } from '../models/User';
import { AuthService } from './auth.service';

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
  private proteinTarget;
  private fatTarget;
  private carbTarget;

  constructor(private auth: AuthService) {}

  setMealsFromLocalStorage() {
    const user = this.auth.getUserInfo();
    this._meals.next(user.meals);
    this.setTargets();
  }

  setTargets() {
    const user = this.auth.getUserInfo();
    if (user.weight) {
      this.proteinTarget = user.weight * 2;
      this.fatTarget = user.weight;
      if (!user.userAddedExpenditure) {
        this.carbTarget =
          (user.dailyExpenditure -
            this.proteinTarget * 4 -
            this.fatTarget * 9) /
          4;
      } else {
        this.carbTarget =
          (user.userAddedExpenditure -
            this.proteinTarget * 4 -
            this.fatTarget * 4) /
          4;
      }
    } else if (!user.weight && user.userAddedExpenditure) {
      this.proteinTarget = (user.userAddedExpenditure * 0.3) / 4;
      this.carbTarget = (user.userAddedExpenditure * 0.4) / 4;
      this.fatTarget = (user.userAddedExpenditure * 0.3) / 9;
    } else if (!user || (!user.weight && !user.userAddedExpenditure)) {
      this.proteinTarget = (user.dailyExpenditure * 0.3) / 4;
      this.carbTarget = (user.dailyExpenditure * 0.4) / 4;
      this.fatTarget = (user.dailyExpenditure * 0.3) / 9;
    }
    const targets = {
      dailyExpenditure: user.dailyExpenditure,
      userAddedExpenditure: user.userAddedExpenditure,
      userAddedCarbTarget: user.userAddedCarbTarget,
      userAddedFatTarget: user.userAddedFatTarget,
      userAddedProteinTarget: user.userAddedProteinTarget,
      proteinTarget: this.proteinTarget,
      carbTarget: this.carbTarget,
      fatTarget: this.fatTarget
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
