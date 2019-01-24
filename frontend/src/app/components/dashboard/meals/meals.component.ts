import { Component, OnInit, Input } from '@angular/core';
import { Meal } from '../../../models/Meal';
import { AddedFoodsService } from '../../../services/added-foods.service';
import { BehaviorSubject } from 'rxjs';
import { Food } from '../../../models/Food';
import { DayService } from '../../../services/day.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from '../../../models/User';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit {
  addedMeals: Meal[];
  _foods = new BehaviorSubject<Food[]>([]);
  _user = new BehaviorSubject<User>(null);
  openedSavedMeal = false;
  mealsEdited = false;

  @Input()
  set foods(foods) {
    this._foods.next(foods);
  }

  get foods() {
    return this._foods.getValue();
  }

  @Input()
  set user(user) {
    this._user.next(user);
  }

  get user() {
    return this._user.getValue();
  }

  constructor(
    private addedFoodsService: AddedFoodsService,
    private dayService: DayService,
    private flashMessage: FlashMessagesService,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.addedFoodsService._meals.subscribe(meals => (this.addedMeals = meals));
    this.addedFoodsService._openedSavedMeal.subscribe(b => (this.openedSavedMeal = b));
    this.addedFoodsService._mealsEdited.subscribe(b => (this.mealsEdited = b));
  }

  saveEditedDay() {
    const meals = JSON.parse(localStorage.getItem('meals'));
    let foodsAdded = 0;
    meals.forEach(m => {
      foodsAdded += m.foods.length;
    });
    if (foodsAdded === 0) {
      this.flashMessage.show(this.translator.instant('NO_FOODS_IN_MEALS_ERROR'), {
        cssClass: 'alert-danger',
        timeout: 2000
      });
      return;
    }

    const d = JSON.parse(localStorage.getItem('loadedDay'));
    const editedDay = {
      _id: d,
      meals: meals
    };
    this.dayService.saveEditedDay(editedDay).subscribe(
      success => {
        if (success) {
          this.flashMessage.show(this.translator.instant('DAY_SAVED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
        }
        this.addedFoodsService._mealsEdited.next(false);
      },
      (error: Error) => {
        this.flashMessage.show(error['error'].msg, {
          cssClass: 'alert-danger',
          timeout: 2000
        });
      }
    );
  }
}
