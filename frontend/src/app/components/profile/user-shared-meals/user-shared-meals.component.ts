import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/User';
import { FoodService } from '../../../services/food.service';
import { SharedMealsService } from '../../../services/shared-meals.service';
import { Food } from '../../../models/Food';
import { Meal } from '../../../models/Meal';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-shared-meals',
  templateUrl: './user-shared-meals.component.html',
  styleUrls: ['./user-shared-meals.component.css']
})
export class UserSharedMealsComponent implements OnInit {
  user: User;
  allFoods: Food[];
  sharedMeals: Meal[] = [];
  deletedSharedMeals = [];
  sharedMealsDeleted = false;
  selectedSharedMeal: Meal;
  selectedSharedMealOrigFoods: Food[];
  sharedMealTag = '';
  selectedSharedMealOrigTags = undefined;
  loading = true;

  constructor(
    private auth: AuthService,
    private foodService: FoodService,
    private sharedMealsService: SharedMealsService,
    private flashMessage: FlashMessagesService,
    private modalService: NgbModal,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user = user;
      if (user.username) {
        this.sharedMealsService.getMealsByUser(this.user.username).subscribe(meals => {
          this.sharedMeals = meals;
          this.foodService.getAllFoods().subscribe(foods => {
            this.allFoods = foods;
            this.loading = false;
          });
        });
      }
    });
  }

  deleteSharedMeal(index) {
    this.deletedSharedMeals.push(this.sharedMeals[index]._id);
    this.sharedMeals.splice(index, 1);
    this.sharedMealsDeleted = true;
  }

  deleteSharedMealsFromDb() {
    this.sharedMealsService.removeMeals(this.deletedSharedMeals).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.sharedMealsService.getMealsByUser(this.user.username).subscribe(meals => {
            this.sharedMeals = meals;
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
      this.selectedSharedMealOrigFoods = JSON.parse(JSON.stringify(this.selectedSharedMeal.foods));
    }

    if (!this.selectedSharedMealOrigTags) {
      this.selectedSharedMealOrigTags = JSON.parse(JSON.stringify(this.selectedSharedMeal.tags));
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
          this.sharedMealsService.saveEditedMeal(this.selectedSharedMeal).subscribe(res => {
            if (res['success']) {
              this.sharedMealsService.getMealsByUser(this.user.username).subscribe(meals => {
                this.sharedMeals = meals;
                this.selectedSharedMealOrigFoods = undefined;
                this.selectedSharedMeal = undefined;
                this.sharedMealTag = '';
                this.selectedSharedMealOrigTags = undefined;
                this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
                  cssClass: 'alert-success',
                  timeout: 2000
                });
              });
            }
          });
        } else {
          this.selectedSharedMeal.foods = this.selectedSharedMealOrigFoods;
          this.selectedSharedMeal.tags = this.selectedSharedMealOrigTags;
          this.selectedSharedMealOrigFoods = undefined;
          this.selectedSharedMealOrigTags = undefined;
          this.sharedMealTag = '';
        }
      },
      dismissed => {
        this.selectedSharedMeal.foods = this.selectedSharedMealOrigFoods;
        this.selectedSharedMeal.tags = this.selectedSharedMealOrigTags;
        this.selectedSharedMealOrigFoods = undefined;
        this.selectedSharedMealOrigTags = undefined;
        this.sharedMealTag = '';
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

  addTagToSharedMealTags(char) {
    if (this.sharedMealTag.length >= 3 && char === ',') {
      this.selectedSharedMeal.tags.push(this.sharedMealTag.slice(0, this.sharedMealTag.length - 1));
      this.sharedMealTag = '';
    }
  }

  removeTagFromSharedMealTags(index) {
    this.selectedSharedMeal.tags.splice(index, 1);
  }
}
