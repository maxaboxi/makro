import { Injectable } from '@angular/core';
import { Meal } from '../models/Meal';
import { BehaviorSubject } from 'rxjs';
import { Food } from '../models/Food';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AddedFoodsService {
  _showTargets = new BehaviorSubject<boolean>(true);
  _mealsEdited = new BehaviorSubject<boolean>(false);
  _openedSavedMeal = new BehaviorSubject<boolean>(false);
  _meals = new BehaviorSubject<Meal[]>([]);
  _totals = new BehaviorSubject<any>({
    energy: 0,
    protein: 0,
    carb: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    amount: 0
  });
  _targets = new BehaviorSubject<any>(null);
  private proteinTarget;
  private fatTarget;
  private carbTarget;

  constructor(private auth: AuthService) {}

  setShowTargets() {
    this._showTargets.next(!this._showTargets.getValue());
  }

  setMealsFromLocalStorage() {
    this._meals.next(JSON.parse(localStorage.getItem('meals')));
    this.setTargets();
    this.setTotals();
  }

  resetMeals() {
    const meals = this.getMeals();
    meals.forEach(m => {
      m.foods = [];
    });
    this._meals.next(meals);
    this.resetTotals();
    localStorage.setItem('meals', JSON.stringify(meals));
  }

  resetTotals() {
    this._totals.next({
      energy: 0,
      protein: 0,
      carb: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      amount: 0
    });
  }

  setTotals() {
    this.resetTotals();
    const t = this._totals.getValue();
    const meals = this.getMeals();
    if (meals) {
      meals.forEach(m => {
        m.foods.forEach(f => {
          t.energy += f.energia;
          t.protein += f.proteiini;
          t.carb += f.hh;
          t.fat += f.rasva;
          t.fiber += f.kuitu;
          t.sugar += f.sokeri;
          t.amount += f.amount;
        });
      });
    }
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
    } else if (!user.weight && !user.userAddedExpenditure) {
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
    if (this._openedSavedMeal.getValue()) {
      this._mealsEdited.next(true);
    }
    if (this._meals.getValue().length === 0) {
      this.setMealsFromLocalStorage();
    }
    if (e.food) {
      const food: Food = {
        _id: e.food._id,
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
      t.fiber += food.kuitu;
      t.sugar += food.sokeri;
      t.amount += food.amount;
      this._totals.next(t);
      this._meals.getValue().forEach(m => {
        if (m.name === e.meal) {
          m.foods.push(food);
        }
      });
      localStorage.setItem('meals', JSON.stringify(this._meals.getValue()));
    }
  }

  moveFoodToNewMeal(food, mealName, componentIndex) {
    console.log('a');
    if (this._openedSavedMeal.getValue()) {
      this._mealsEdited.next(true);
    }
    if (this._meals.getValue().length === 0) {
      this.setMealsFromLocalStorage();
    }
    if (food) {
      this._meals.getValue().forEach(m => {
        if (m.name === mealName) {
          m.foods.push(food);
        }
      });
      this.removeFoodFromMeal(food._id, componentIndex);
    }
  }

  removeFoodFromMeal(foodId, componentIndex) {
    const meals = this.getMeals();
    meals[componentIndex].foods.forEach((f, i) => {
      if (f._id === foodId) {
        meals[componentIndex].foods.splice(i, 1);
      }
    });
    this._meals.next(meals);
    localStorage.setItem('meals', JSON.stringify(this._meals.getValue()));
  }

  updateMealsInLocalStorage(meal) {
    this._mealsEdited.next(true);
    const meals = this.getMeals();
    for (let m of meals) {
      if (m.name === meal.name) {
        m.foods = meal.foods;
        localStorage.setItem('meals', JSON.stringify(meals));
        this._meals.next(meals);
        this.setTotals();
        break;
      }
    }
  }
}
