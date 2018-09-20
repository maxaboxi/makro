import {
  Component,
  OnInit,
  Input,
  DoCheck,
  IterableDiffers
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Food } from '../../../../models/Food';
import { Meal } from '../../../../models/Meal';
import { AddedFoodsService } from '../../../../services/added-foods.service';

@Component({
  selector: 'app-meal-table',
  templateUrl: './meal-table.component.html',
  styleUrls: ['./meal-table.component.css']
})
export class MealTableComponent implements OnInit, DoCheck {
  private _componentIndex = new BehaviorSubject(null);
  private _meal = new BehaviorSubject<Meal>(null);
  private _foods = new BehaviorSubject<Food[]>([]);
  private energyTotal = 0;
  private proteinTotal = 0;
  private carbTotal = 0;
  private fatTotal = 0;
  private amountTotal = 0;
  private iterableDiffer;
  private newFoodAmount = null;
  private dropTargetIndex = null;

  @Input()
  set meal(meal) {
    this._meal.next(meal);
  }

  get meal() {
    return this._meal.getValue();
  }

  @Input()
  set foods(foods) {
    this._foods.next(foods);
  }

  get foods() {
    return this._foods.getValue();
  }

  @Input()
  set componentIndex(i) {
    this._componentIndex.next(i);
  }

  get componentIndex() {
    return this._componentIndex.getValue();
  }

  constructor(
    private _iterableDiffers: IterableDiffers,
    private addedFoodsService: AddedFoodsService
  ) {
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
        this.energyTotal += f.energia;
        this.proteinTotal += f.proteiini;
        this.carbTotal += f.hh;
        this.fatTotal += f.rasva;
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
      this.energyTotal += f.energia;
      this.proteinTotal += f.proteiini;
      this.carbTotal += f.hh;
      this.fatTotal += f.rasva;
      this.amountTotal += f.amount;
    });
  }

  updateAmount(selectedFood, index) {
    if (!this.newFoodAmount) {
      this.meal.foods[index].editing = false;
      return;
    }
    let food;
    if (selectedFood._id) {
      food = this.returnOriginalFoodValues(selectedFood._id, null);
    } else {
      food = this.returnOriginalFoodValues(null, selectedFood.name);
    }

    this.meal.foods[index].amount = this.newFoodAmount;
    this.newFoodAmount /= 100;
    this.meal.foods[index].energia = food[0].energia * this.newFoodAmount;
    this.meal.foods[index].proteiini = food[0].proteiini * this.newFoodAmount;
    this.meal.foods[index].hh = food[0].hh * this.newFoodAmount;
    this.meal.foods[index].rasva = food[0].rasva * this.newFoodAmount;
    this.meal.foods[index].kuitu = food[0].kuitu * this.newFoodAmount;
    this.meal.foods[index].sokeri = food[0].sokeri * this.newFoodAmount;
    this.meal.foods[index].editing = false;
    this.calculateTotals();
    this.addedFoodsService.updateMealsInLocalStorage(this.meal);
    this.newFoodAmount = null;
  }

  returnOriginalFoodValues(id, name) {
    if (id) {
      return this.foods.filter(f => {
        if (f._id === id) {
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

  removeFood(index) {
    this.meal.foods.splice(index, 1);
    this.addedFoodsService.updateMealsInLocalStorage(this.meal);
  }

  setTarget(index) {
    this.dropTargetIndex = index;
  }

  drag(ev, food) {
    ev.dataTransfer.setData('food', JSON.stringify(food));
    ev.dataTransfer.setData('index', this.componentIndex);
    ev.dataTransfer.setData('start', ev.target.id);
  }

  drop(ev) {
    const food = JSON.parse(ev.dataTransfer.getData('food'));
    const mealName = this.meal.name;
    const index = ev.dataTransfer.getData('index');
    const start = ev.dataTransfer.getData('start');
    if (parseInt(index) === parseInt(this.componentIndex)) {
      setTimeout(() => {
        this.meal.foods.splice(start, 1);
        this.meal.foods.splice(this.dropTargetIndex, 0, food);
        this.addedFoodsService.updateMealsInLocalStorage(this.meal);
      }, 10);
      return;
    } else {
      this.addedFoodsService.moveFoodToNewMeal(food, mealName, index);
    }
  }

  allowDrop(ev) {
    ev.preventDefault();
  }
}
