import { Component, OnInit, Input, DoCheck, IterableDiffers } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Food } from '../../../../models/Food';
import { Meal } from '../../../../models/Meal';
import { AddedFoodsService } from '../../../../services/added-foods.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from '../../../../models/User';
import { SharedMealsService } from '../../../../services/shared-meals.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-meal-table',
  templateUrl: './meal-table.component.html',
  styleUrls: ['./meal-table.component.css']
})
export class MealTableComponent implements OnInit, DoCheck {
  private _componentIndex = new BehaviorSubject(null);
  private _meal = new BehaviorSubject<Meal>(null);
  private _foods = new BehaviorSubject<Food[]>([]);
  _user = new BehaviorSubject<User>(null);
  private energyTotal = 0;
  private proteinTotal = 0;
  private carbTotal = 0;
  private fatTotal = 0;
  private amountTotal = 0;
  private iterableDiffer;
  private newFoodAmount = null;
  private dropTargetIndex = null;
  sharedMeal: Meal = {
    username: '',
    name: '',
    info: '',
    foods: [],
    tags: []
  };
  sharedMealTag = '';
  meals: Meal[];
  targetMeal: Meal;
  foodToBeCopied: Food;

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

  @Input()
  set user(user) {
    this._user.next(user);
  }

  get user() {
    return this._user.getValue();
  }

  constructor(
    private _iterableDiffers: IterableDiffers,
    private addedFoodsService: AddedFoodsService,
    private modalService: NgbModal,
    private flashMessage: FlashMessagesService,
    private sharedMealsService: SharedMealsService,
    private translator: TranslateService
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
        this.energyTotal += f.energy;
        this.proteinTotal += f.protein;
        this.carbTotal += f.carbs;
        this.fatTotal += f.fat;
        this.amountTotal += f.amount;
      });
    }
  }

  ngOnInit() {
    this.meals = JSON.parse(localStorage.getItem('meals'));
  }

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

  updateAmount(selectedFood, index) {
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
    this.addedFoodsService.updateMealsInLocalStorage(this.meal);
    this.newFoodAmount = null;
  }

  returnOriginalFoodValues(id, name) {
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
      this.meal.foods.splice(start, 1);
      // dropTargetIndex is the index of the item in array where the cursor is on
      // TODO: needs some work; food is not moved UNLESS the cursor is moved before stuff inside timeout gets executed
      // Kinda fixed by using dragover event to set target.
      this.meal.foods.splice(this.dropTargetIndex, 0, food);
      this.addedFoodsService.updateMealsInLocalStorage(this.meal);
      return;
    } else {
      this.addedFoodsService.moveFoodToNewMeal(food, mealName, index);
    }
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  openShareMealModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          const meal: Meal = {
            name: this.sharedMeal.name,
            foods: this.meal.foods,
            info: this.sharedMeal.info,
            recipe: this.sharedMeal.recipe,
            username: this.user.username,
            tags: this.sharedMeal.tags
          };
          this.sharedMealsService.shareNewMeal(meal).subscribe(
            success => {
              if (success) {
                this.flashMessage.show(this.translator.instant('MEAL_SHARED_SUCCESFULLY'), {
                  cssClass: 'alert-success',
                  timeout: 2000
                });
                this.sharedMeal.name = '';
                this.sharedMeal.info = '';
                this.sharedMeal.tags = [];
              }
            },
            (error: Error) => {
              this.flashMessage.show(error['error'].msg, {
                cssClass: 'alert-danger',
                timeout: 2000
              });
            }
          );
        } else {
          this.sharedMeal.name = '';
          this.sharedMeal.info = '';
          this.sharedMeal.tags = [];
        }
      },
      dismissed => {
        this.sharedMeal.name = '';
        this.sharedMeal.info = '';
        this.sharedMeal.tags = [];
      }
    );
  }

  openCopyFoodModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.addedFoodsService.moveFoodToNewMeal(JSON.parse(JSON.stringify(this.foodToBeCopied)), this.targetMeal.name, null);
          this.foodToBeCopied = undefined;
          this.targetMeal = undefined;
        } else {
          this.foodToBeCopied = undefined;
          this.targetMeal = undefined;
        }
      },
      dismissed => {
        this.foodToBeCopied = undefined;
        this.targetMeal = undefined;
      }
    );
  }

  addTagToSharedMealTags(char) {
    if (this.sharedMealTag.length >= 3 && char === ',') {
      this.sharedMeal.tags.push(this.sharedMealTag.slice(0, this.sharedMealTag.length - 1));
      this.sharedMealTag = '';
    }
  }

  removeTagFromSharedMealTags(index) {
    this.sharedMeal.tags.splice(index, 1);
  }
}
