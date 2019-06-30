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
  _previousMealsSavedToLocalStorage = new BehaviorSubject<boolean>(false);
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
    this.auth.updateShowTargets(this._showTargets.getValue());
  }

  setMealsFromLocalStorage() {
    this._meals.next(JSON.parse(localStorage.getItem('meals')));
    this.setTargets();
    this.setTotals();
  }

  setPreviousMealsFromLocalStorage() {
    this._meals.next(JSON.parse(localStorage.getItem('previousMeals')));
    this.setTargets();
    this.setTotals();
  }

  resetMeals(meals: Meal[]) {
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
          t.energy += f.energy;
          t.protein += f.protein;
          t.carb += f.carbs;
          t.fat += f.fat;
          t.fiber += f.fiber;
          t.sugar += f.sugar;
          t.amount += f.amount;
        });
      });
    }
  }

  setTargets() {
    const user = this.auth.getUserInfo();
    this._showTargets.next(user.showTargets);
    if (user.weight) {
      this.proteinTarget = user.weight * 2;
      this.fatTarget = user.weight;
      if (!user.userAddedExpenditure) {
        this.carbTarget = (user.dailyExpenditure - this.proteinTarget * 4 - this.fatTarget * 9) / 4;
      } else {
        this.carbTarget = (user.userAddedExpenditure - this.proteinTarget * 4 - this.fatTarget * 4) / 4;
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
        uuid: e.food.uuid,
        name: e.food.name,
        energy: e.food.energy * (e.amount / 100),
        protein: e.food.protein * (e.amount / 100),
        carbs: e.food.carbs * (e.amount / 100),
        fat: e.food.fat * (e.amount / 100),
        fiber: e.food.fiber * (e.amount / 100),
        sugar: e.food.sugar * (e.amount / 100),
        amount: e.amount
      };
      const t = this._totals.getValue();
      t.energy += food.energy;
      t.protein += food.protein;
      t.carb += food.carbs;
      t.fat += food.fat;
      t.fiber += food.fiber;
      t.sugar += food.sugar;
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
      if (componentIndex) {
        this.removeFoodFromMeal(food, componentIndex);
      } else {
        const meals = this.getMeals();
        for (let m of meals) {
          if (m.name === mealName) {
            this.updateMealsInLocalStorage(m);
            break;
          }
        }
      }
    }
  }

  removeFoodFromMeal(food, componentIndex) {
    const meals = this.getMeals();
    // Changed to regular for instead of forEach to be able to break the loop
    for (let i = 0; i < meals[componentIndex].foods.length; i++) {
      // Check if food has ID since days saved in previous version don't include food IDs
      if (food.uuid) {
        if (meals[componentIndex].foods[i].uuid === food.uuid && meals[componentIndex].foods[i].amount === food.amount) {
          meals[componentIndex].foods.splice(i, 1);
          break;
        }
      } else {
        if (meals[componentIndex].foods[i].name === food.name && meals[componentIndex].foods[i].amount === food.amount) {
          meals[componentIndex].foods.splice(i, 1);
          break;
        }
      }
    }
    this._meals.next(meals);
    localStorage.setItem('meals', JSON.stringify(this._meals.getValue()));
  }

  updateMealsInLocalStorage(meal) {
    if (this._openedSavedMeal.getValue()) {
      this._mealsEdited.next(true);
    }
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
