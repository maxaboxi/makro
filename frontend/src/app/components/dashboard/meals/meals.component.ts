import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Meal } from '../../../models/Meal';
import { AddedFoodsService } from '../../../services/added-foods.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Food } from '../../../models/Food';
import { DayService } from '../../../services/day.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from '../../../models/User';
import { TranslateService } from '@ngx-translate/core';
import { Day } from '../../../models/Day';
import { NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit, OnDestroy {
  addedMeals: Meal[];
  _foods = new BehaviorSubject<Food[]>([]);
  _user = new BehaviorSubject<User>(null);
  openedSavedMeal = false;
  mealsEdited = false;
  day: Day = {
    userId: '',
    name: '',
    allMeals: null
  };
  dayName = '';
  date: NgbDateStruct = null;
  previousFoodsInLocalStorage = false;

  private subscriptions = new Subscription();

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
    private translator: TranslateService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.subscriptions.add(this.addedFoodsService._meals.subscribe(meals => (this.addedMeals = meals)));
    this.subscriptions.add(this.addedFoodsService._openedSavedMeal.subscribe(b => (this.openedSavedMeal = b)));
    this.subscriptions.add(this.addedFoodsService._mealsEdited.subscribe(b => (this.mealsEdited = b)));
    this.subscriptions.add(this.addedFoodsService._previousMealsSavedToLocalStorage.subscribe(b => (this.previousFoodsInLocalStorage = b)));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  saveEditedDay() {
    const meals = JSON.parse(localStorage.getItem('meals'));
    let foodsAdded = 0;
    meals.forEach((m: Meal, i: number) => {
      foodsAdded += m.foods.length;
      m.index = m.index === 99 ? i : m.index;
    });
    if (foodsAdded === 0) {
      this.flashMessage.show(this.translator.instant('NO_FOODS_IN_MEALS_ERROR'), {
        cssClass: 'alert-danger',
        timeout: 2000
      });
      return;
    }

    const d = JSON.parse(localStorage.getItem('loadedDay'));
    const editedDay: Day = {
      uuid: d.id,
      allMeals: meals,
      userId: this.user.uuid
    };
    this.subscriptions.add(
      this.dayService.saveEditedDay(editedDay).subscribe(
        res => {
          if (res['success']) {
            localStorage.setItem('loadedDay', JSON.stringify({ id: res['message'], name: d['name'] }));
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
      )
    );
  }

  openSaveDayModal(content) {
    const meals = JSON.parse(localStorage.getItem('meals'));
    let foodsAdded = 0;
    meals.forEach((m: Meal, i: number) => {
      foodsAdded += m.foods.length;
      m.index = m.index === 99 ? i : m.index;
    });
    if (foodsAdded === 0) {
      this.flashMessage.show(this.translator.instant('NO_FOODS_IN_MEALS_ERROR'), {
        cssClass: 'alert-danger',
        timeout: 2000
      });
      return;
    }
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          const newDay: Day = {
            name: this.day.name,
            allMeals: meals,
            userId: this.user.uuid,
            date: this.date !== null ? new Date(this.date.year, this.date.month - 1, this.date.day) : null
          };
          this.subscriptions.add(
            this.dayService.saveNewDay(newDay).subscribe(
              success => {
                if (success) {
                  this.flashMessage.show(this.translator.instant('DAY_SAVED'), {
                    cssClass: 'alert-success',
                    timeout: 2000
                  });
                  this.day.name = '';
                  this.addedFoodsService._mealsEdited.next(false);
                }
              },
              (error: Error) => {
                this.flashMessage.show(error['error'].msg, {
                  cssClass: 'alert-danger',
                  timeout: 2000
                });
              }
            )
          );
        } else {
          this.day.name = '';
        }
      },
      dismissed => {
        this.day.name = '';
      }
    );
  }

  reloadPreviousFoods() {
    const day = JSON.parse(localStorage.getItem('previousMeals'));
    this.addedFoodsService.setPreviousMealsFromLocalStorage();
    this.dayService.loadedDayName.next(day['name']);
    this.addedFoodsService._mealsEdited.next(false);

    if (day['id'] && day['id'].length > 0) {
      this.addedFoodsService._openedSavedMeal.next(true);
      localStorage.setItem('loadedDay', JSON.stringify({ id: day['id'], name: day['name'] }));
    } else {
      localStorage.removeItem('loadedDay');
      this.addedFoodsService._openedSavedMeal.next(false);
    }

    this.deletePreviousFoods();
  }

  deletePreviousFoods() {
    localStorage.removeItem('previousMeals');
    this.addedFoodsService._previousMealsSavedToLocalStorage.next(false);
  }
}
