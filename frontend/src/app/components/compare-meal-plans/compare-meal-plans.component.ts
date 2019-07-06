import { Component, OnInit, Input } from '@angular/core';
import { DayService } from 'src/app/services/day.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AddedFoodsService } from 'src/app/services/added-foods.service';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ConnectionService } from 'src/app/services/connection.service';
import { User } from 'src/app/models/User';
import { BehaviorSubject } from 'rxjs';
import { Day } from 'src/app/models/Day';
import { Meal } from 'src/app/models/Meal';
import { Food } from 'src/app/models/Food';
import { FoodService } from 'src/app/services/food.service';

@Component({
  selector: 'app-compare-meal-plans',
  templateUrl: './compare-meal-plans.component.html',
  styleUrls: ['./compare-meal-plans.component.css']
})
export class CompareMealPlansComponent implements OnInit {
  online: boolean;
  _user = new BehaviorSubject<User>(null);
  savedDays: Day[] = [];
  savedDaysFirst: Day[] = [];
  savedDaysSecond: Day[] = [];
  loading = true;
  currentlyPlannedMeals: Meal[];
  selectedDayIds: string[] = [];
  fetchedDays: Day[] = [];
  showDayList = true;
  verticalDisplay = true;
  foods: Food[];

  @Input()
  get user() {
    return this._user.getValue();
  }

  constructor(
    private dayService: DayService,
    private flashMessage: FlashMessagesService,
    private addedFoodsService: AddedFoodsService,
    private auth: AuthService,
    private translate: TranslateService,
    private connectionService: ConnectionService,
    private foodService: FoodService
  ) {}

  ngOnInit() {
    this.connectionService.monitor().subscribe(res => (this.online = res));
    this.auth.user.subscribe(user => {
      this._user.next(user);
      this.setCurrentlyPlannedMeals();
      this.dayService.getAllSavedDays().subscribe(
        days => {
          this.savedDays = JSON.parse(JSON.stringify(days));
          if (days.length % 2 === 0) {
            this.savedDaysFirst = days.splice(0, Math.floor(days.length / 2));
          } else {
            this.savedDaysFirst = days.splice(0, Math.floor(days.length / 2) + 1);
          }
          this.savedDaysSecond = days;
          this.fetchFoods();
        },
        (error: Error) => {
          this.loading = false;
          this.flashMessage.show(this.translate.instant('NETWORK_LOADING_ERROR'), {
            cssClass: 'alert-danger',
            timeout: 2000
          });
        }
      );
    });
  }

  fetchFoods() {
    this.foodService.getAllFoods();
    this.loading = true;
    this.foodService.allFoods.subscribe(foods => {
      this.foods = foods;
      this.loading = false;
    });
  }

  setCurrentlyPlannedMeals() {
    const meals = this.addedFoodsService.getMeals();
    let foodsFound = false;
    meals.forEach(m => {
      if (m.foods.length > 0) {
        foodsFound = true;
      }
    });

    if (foodsFound) {
      this.currentlyPlannedMeals = meals;
    }
  }

  selectDay(e: any, dayId: string) {
    if (e.checked) {
      if (dayId === 'current') {
        this.fetchedDays.push({
          allMeals: this.currentlyPlannedMeals,
          userId: this.user.uuid,
          uuid: dayId,
          name: this.translate.instant('CURRENT_MEALPLAN')
        });
      }

      this.selectedDayIds.push(dayId);
    } else {
      if (dayId === 'current') {
        this.fetchedDays.forEach((d, index) => {
          if (d.uuid === dayId) {
            this.fetchedDays.splice(index, 1);
          }
        });
      } else {
        this.selectedDayIds.forEach((id, index) => {
          if (id === dayId) {
            this.selectedDayIds.splice(index, 1);
          }
        });
      }
    }
  }

  fetchSelectedMealplans() {
    if (this.selectedDayIds.length === 0) {
      return;
    }

    this.loading = true;

    this.dayService.getMultipleSavedDays(this.selectedDayIds).subscribe(
      days => {
        this.fetchedDays = this.fetchedDays.concat(days);
        this.loading = false;
        this.selectedDayIds = [];
        this.showDayList = false;
      },
      (error: Error) => {
        this.loading = false;
        this.flashMessage.show(this.translate.instant('NETWORK_LOADING_ERROR'), {
          cssClass: 'alert-danger',
          timeout: 2000
        });
        this.selectedDayIds = [];
      }
    );
  }

  calculateDayTotals(day: Day) {
    return this.addedFoodsService.calculateTotals(day.allMeals);
  }
}
