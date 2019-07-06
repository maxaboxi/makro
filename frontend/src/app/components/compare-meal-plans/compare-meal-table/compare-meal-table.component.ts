import { Component, OnInit, Input, IterableDiffers } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Meal } from 'src/app/models/Meal';
import { Food } from 'src/app/models/Food';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-compare-meal-table',
  templateUrl: './compare-meal-table.component.html',
  styleUrls: ['./compare-meal-table.component.css']
})
export class CompareMealTableComponent implements OnInit {
  private _meal = new BehaviorSubject<Meal>(null);
  private _foods = new BehaviorSubject<Food[]>([]);
  private _user = new BehaviorSubject<User>(null);
  private energyTotal = 0;
  private proteinTotal = 0;
  private carbTotal = 0;
  private fatTotal = 0;
  private amountTotal = 0;
  private newFoodAmount = null;
  private iterableDiffer;

  @Input()
  set meal(meal: Meal) {
    this._meal.next(meal);
  }

  get meal() {
    return this._meal.getValue();
  }

  @Input()
  set foods(foods: Food[]) {
    this._foods.next(foods);
  }

  get foods() {
    return this._foods.getValue();
  }

  @Input()
  set user(user: User) {
    this._user.next(user);
  }

  get user() {
    return this._user.getValue();
  }

  constructor(private _iterableDiffers: IterableDiffers) {
    this.iterableDiffer = this._iterableDiffers.find([]).create(null);
  }

  ngDoCheck() {
    const changes = this.iterableDiffer.diff(this.meal['foods']);
    if (changes) {
      this.energyTotal = 0;
      this.proteinTotal = 0;
      this.carbTotal = 0;
      this.fatTotal = 0;
      this.amountTotal = 0;
      changes.collection.forEach(f => {
        this.energyTotal += f.energy;
        this.proteinTotal += f.protein;
        this.carbTotal += f.carbs;
        this.fatTotal += f.fat;
        this.amountTotal += f.amount;
      });
    }
  }

  ngOnInit() {}

  calculateTotals() {
    this.energyTotal = 0;
    this.proteinTotal = 0;
    this.carbTotal = 0;
    this.fatTotal = 0;
    this.amountTotal = 0;
    this.meal.foods.forEach(f => {
      this.energyTotal += f.energy;
      this.proteinTotal += f.protein;
      this.carbTotal += f.carbs;
      this.fatTotal += f.fat;
      this.amountTotal += f.amount;
    });
  }

  updateAmount(selectedFood: Food, index: number) {
    if (this.newFoodAmount == null) {
      this.meal.foods[index].editing = false;
      return;
    }
    let food;
    if (selectedFood.uuid) {
      food = this.returnOriginalFoodValues(selectedFood.uuid, null);
    } else {
      food = this.returnOriginalFoodValues(null, selectedFood.name);
    }

    this.meal.foods[index].amount = this.newFoodAmount;
    this.newFoodAmount /= 100;
    this.meal.foods[index].energy = food[0].energy * this.newFoodAmount;
    this.meal.foods[index].protein = food[0].protein * this.newFoodAmount;
    this.meal.foods[index].carbs = food[0].carbs * this.newFoodAmount;
    this.meal.foods[index].fat = food[0].fat * this.newFoodAmount;
    this.meal.foods[index].fiber = food[0].fiber * this.newFoodAmount;
    this.meal.foods[index].sugar = food[0].sugar * this.newFoodAmount;
    this.meal.foods[index].editing = false;
    this.calculateTotals();
    this.newFoodAmount = null;
  }

  returnOriginalFoodValues(id: string, name: string) {
    if (id) {
      return this.foods.filter(f => {
        if (f.uuid === id) {
          return f;
        }
      });
    } else {
      return this.foods.filter(f => {
        if (f.name === name) {
          return f;
        }
      });
    }
  }

  removeFood(index: number) {
    this.meal.foods.splice(index, 1);
  }
}
