import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/User';
import { FoodService } from '../../../services/food.service';
import { SharedMealsService } from '../../../services/shared-meals.service';
import { Food } from '../../../models/Food';
import { Meal } from '../../../models/Meal';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-shared-meals',
  templateUrl: './user-shared-meals.component.html',
  styleUrls: ['./user-shared-meals.component.css']
})
export class UserSharedMealsComponent implements OnInit {
  user: User;
  allFoods: Food[];
  sharedMeals: Meal[] = [];
  sharedMealsFirst: Meal[] = [];
  sharedMealsSecond: Meal[] = [];
  sharedMealsSplit = false;
  deletedSharedMeals = [];
  sharedMealsDeleted = false;
  selectedSharedMeal: Meal;
  selectedSharedMealOrigFoods: Food[];

  constructor(
    private auth: AuthService,
    private foodService: FoodService,
    private sharedMealsService: SharedMealsService,
    private flashMessage: FlashMessagesService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user = user;
      if (user.username) {
        this.sharedMealsService
          .getMealsByUser(this.user.username)
          .subscribe(meals => {
            this.sortSharedMeals(meals);
            this.foodService
              .getAllFoods()
              .subscribe(foods => (this.allFoods = foods));
          });
      }
    });
  }

  sortSharedMeals(meals) {
    if (meals.length <= 10) {
      this.sharedMealsSplit = false;
      this.sharedMeals = meals;
    } else {
      this.sharedMealsSplit = true;
      if (meals.length % 2 === 0) {
        this.sharedMealsFirst = meals.splice(0, Math.floor(meals.length / 2));
      } else {
        this.sharedMealsFirst = meals.splice(
          0,
          Math.floor(meals.length / 2) + 1
        );
      }
      this.sharedMealsSecond = meals;
    }
  }

  deleteSharedMeal(index, array) {
    if (array === 'sharedMeals') {
      this.deletedSharedMeals.push(this.sharedMeals[index]._id);
      this.sharedMeals.splice(index, 1);
    }

    if (array === 'sharedMealsFirst') {
      this.deletedSharedMeals.push(this.sharedMealsFirst[index]._id);
      this.sharedMealsFirst.splice(index, 1);
    }

    if (array === 'sharedMealsSecond') {
      this.deletedSharedMeals.push(this.sharedMealsSecond[index]._id);
      this.sharedMealsSecond.splice(index, 1);
    }

    this.sharedMealsDeleted = true;
  }

  deleteSharedMealsFromDb() {
    this.sharedMealsService.removeMeals(this.deletedSharedMeals).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show('Muutokset tallennettu.', {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.sharedMealsService
            .getMealsByUser(this.user.username)
            .subscribe(meals => {
              this.sortSharedMeals(meals);
            });
          this.sharedMealsDeleted = false;
        }
      },
      (error: Error) => {
        this.flashMessage.show(error['error'].msg, {
          cssClass: 'alert-danger',
          timeout: 2000
        });
      }
    );
  }

  openEditSharedMealModal(content, meal) {
    this.selectedSharedMeal = meal;
    if (!this.selectedSharedMealOrigFoods) {
      this.selectedSharedMealOrigFoods = JSON.parse(
        JSON.stringify(this.selectedSharedMeal.foods)
      );
    }
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.selectedSharedMeal.foods.forEach((f, i) => {
            if (!f.amount || f.amount === 0) {
              this.selectedSharedMeal.foods.splice(i, 1);
            }
            if (f.amount !== 100) {
              const a = f.amount / 100;
              const origFood = this.returnOriginalFoodValues(f._id, f.name);
              f.energia = origFood[0].energia * a;
              f.proteiini = origFood[0].proteiini * a;
              f.hh = origFood[0].hh * a;
              f.rasva = origFood[0].rasva * a;
              f.kuitu = origFood[0].kuitu * a;
              f.sokeri = origFood[0].sokeri * a;
            }
          });
          this.sharedMealsService
            .saveEditedMeal(this.selectedSharedMeal)
            .subscribe(res => {
              if (res['success']) {
                this.sharedMealsService
                  .getMealsByUser(this.user.username)
                  .subscribe(meals => {
                    this.sortSharedMeals(meals);
                    this.selectedSharedMealOrigFoods = undefined;
                    this.selectedSharedMeal = undefined;
                  });
              }
            });
        } else {
          this.selectedSharedMeal.foods = this.selectedSharedMealOrigFoods;
          this.selectedSharedMealOrigFoods = undefined;
        }
      },
      dismissed => {
        this.selectedSharedMeal.foods = this.selectedSharedMealOrigFoods;
        this.selectedSharedMealOrigFoods = undefined;
      }
    );
  }

  removeFoodFromSharedMeal(i) {
    this.selectedSharedMeal.foods.splice(i, 1);
  }

  returnOriginalFoodValues(id, name) {
    if (id) {
      return this.allFoods.filter(f => {
        if (f._id === id) {
          return f;
        }
      });
    } else {
      return this.allFoods.filter(f => {
        if (f.name === name) {
          return f;
        }
      });
    }
  }
}
