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
import { Router } from '@angular/router';
import { AddedFoodsService } from 'src/app/services/added-foods.service';

@Component({
  selector: 'app-user-shared-meals',
  templateUrl: './user-shared-meals.component.html',
  styleUrls: ['./user-shared-meals.component.css']
})
export class UserSharedMealsComponent implements OnInit {
  user: User;
  allFoods: Food[];
  sharedMeals: Meal[] = [];
  savedMeals: Meal[] = [];
  deletedSharedMeals = [];
  deletedSavedMeals = [];
  sharedMealsDeleted = false;
  savedMealsDeleted = false;
  selectedSharedMeal: Meal;
  selectedSharedMealOrigFoods: Food[];
  sharedMealTag = '';
  selectedSharedMealOrigTags = undefined;
  loading = true;
  selectedMeal: Meal;
  mealToAddSelectedMeal: Meal;
  amountTotal = 0;
  kcalTotal = 0;
  proteinTotal = 0;
  carbTotal = 0;
  fatTotal = 0;
  meals: Meal[];
  amountToAddPortions = 0;
  amountToAddGrams = 0;

  constructor(
    private auth: AuthService,
    private foodService: FoodService,
    private sharedMealsService: SharedMealsService,
    private flashMessage: FlashMessagesService,
    private modalService: NgbModal,
    private translator: TranslateService,
    private router: Router,
    private addedFoodsService: AddedFoodsService
  ) {}

  ngOnInit() {
    this.meals = JSON.parse(localStorage.getItem('meals'));
    this.auth.user.subscribe(user => {
      this.user = user;
      if (user.username) {
        this.getMeals();
        this.foodService.allFoods.subscribe(foods => {
          this.allFoods = foods;
        });
      }
    });
  }

  private getMeals() {
    this.sharedMealsService.getMealsByUser().subscribe(
      meals => {
        meals.forEach(m => {
          if (m.shared) {
            this.sharedMeals.push(m);
          } else {
            this.savedMeals.push(m);
          }
        });
        this.loading = false;
      },
      (error: Error) => {
        this.loading = false;
        this.flashMessage.show(this.translator.instant('NETWORK_LOADING_ERROR'), {
          cssClass: 'alert-danger',
          timeout: 2000
        });
      }
    );
  }

  deleteSharedMeal(index: number) {
    this.deletedSharedMeals.push(this.sharedMeals[index].uuid);
    this.sharedMeals.splice(index, 1);
    this.sharedMealsDeleted = true;
  }

  deleteSavedMeal(index: number) {
    this.deletedSavedMeals.push(this.savedMeals[index].uuid);
    this.savedMeals.splice(index, 1);
    this.savedMealsDeleted = true;
  }

  deleteSharedMealsFromDb() {
    this.sharedMealsService.removeMeals(this.deletedSharedMeals).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.getMeals();
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

  deleteSavedMealsFromDb() {
    this.sharedMealsService.removeMeals(this.deletedSavedMeals).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.getMeals();
          this.savedMealsDeleted = false;
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

  openAddMealModal(content, meal: Meal) {
    this.sharedMealsService.getSingleMeal(meal.uuid).subscribe(
      res => {
        this.selectedMeal = res;
        this.selectedMeal.foods.forEach(f => {
          this.amountTotal += f.amount;
          this.kcalTotal += f.energy;
          this.proteinTotal += f.protein;
          this.carbTotal += f.carbs;
          this.fatTotal += f.fat;
        });
        this.modalService.open(content, { centered: true }).result.then(
          result => {
            if (result === 'open') {
              this.addMeal();
            } else {
              this.resetAddMealVariables();
            }
          },
          dismissed => {
            this.resetAddMealVariables();
          }
        );
      },
      (error: Error) => {
        this.loading = false;
        this.flashMessage.show(this.translator.instant('NETWORK_LOADING_ERROR'), {
          cssClass: 'alert-danger',
          timeout: 2000
        });
      }
    );
  }

  openEditSharedMealModal(content, meal: Meal) {
    this.sharedMealsService.getSingleMeal(meal.uuid).subscribe(
      res => {
        this.selectedSharedMeal = res;
        if (!this.selectedSharedMealOrigFoods) {
          this.selectedSharedMealOrigFoods = { ...this.selectedSharedMeal.foods };
        }

        if (!this.selectedSharedMealOrigTags) {
          this.selectedSharedMealOrigTags = { ...this.selectedSharedMeal.tags };
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
                  const origFood = this.returnOriginalFoodValues(f.uuid, f.name);
                  f.energy = origFood[0].energy * a;
                  f.protein = origFood[0].protein * a;
                  f.carbs = origFood[0].carbs * a;
                  f.fat = origFood[0].fat * a;
                  f.fiber = origFood[0].fiber * a;
                  f.sugar = origFood[0].sugar * a;
                }
              });
              this.sharedMealsService.saveEditedMeal(this.selectedSharedMeal).subscribe(res => {
                if (res['success']) {
                  this.getMeals();
                  this.selectedSharedMealOrigFoods = undefined;
                  this.selectedSharedMeal = undefined;
                  this.sharedMealTag = '';
                  this.selectedSharedMealOrigTags = undefined;
                  this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
                    cssClass: 'alert-success',
                    timeout: 2000
                  });
                }
              });
            } else {
              this.resetEditSharedMealVariables();
            }
          },
          dismissed => {
            this.resetEditSharedMealVariables();
          }
        );
      },
      (error: Error) => {
        this.loading = false;
        this.flashMessage.show(this.translator.instant('NETWORK_LOADING_ERROR'), {
          cssClass: 'alert-danger',
          timeout: 2000
        });
      }
    );
  }

  removeFoodFromSharedMeal(i: number) {
    this.selectedSharedMeal.foods.splice(i, 1);
  }

  private returnOriginalFoodValues(id: string, name: string) {
    if (id) {
      return this.allFoods.filter(f => {
        if (f.uuid === id) {
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

  addTagToSharedMealTags(char: string) {
    if (this.sharedMealTag.length >= 3 && char === ',') {
      this.selectedSharedMeal.tags.push(this.sharedMealTag.slice(0, this.sharedMealTag.length - 1));
      this.sharedMealTag = '';
    }
  }

  removeTagFromSharedMealTags(index: number) {
    this.selectedSharedMeal.tags.splice(index, 1);
  }

  private addMeal() {
    if (this.amountToAddPortions && this.selectedMeal.portions && !this.amountToAddGrams) {
      this.calculateFoodValuesWithPortions();
    } else if (!this.amountToAddPortions && this.amountToAddGrams) {
      this.calculateFoodValuesWithGrams();
    }

    this.meals.forEach(m => {
      if (m.uuid === this.mealToAddSelectedMeal.uuid) {
        m.foods = m.foods.concat(this.selectedMeal.foods);
      }
    });
    localStorage.setItem('meals', JSON.stringify(this.meals));
    this.addedFoodsService.setMealsFromLocalStorage();
    this.modalService.dismissAll();
    this.router.navigate(['/']);
  }

  private resetAddMealVariables() {
    this.selectedSharedMeal = null;
    this.amountTotal = 0;
    this.kcalTotal = 0;
    this.proteinTotal = 0;
    this.carbTotal = 0;
    this.fatTotal = 0;
    this.amountToAddPortions = 0;
    this.amountToAddGrams = 0;
  }

  private resetEditSharedMealVariables() {
    this.selectedSharedMeal.foods = this.selectedSharedMealOrigFoods;
    this.selectedSharedMeal.tags = this.selectedSharedMealOrigTags;
    this.selectedSharedMealOrigFoods = undefined;
    this.selectedSharedMealOrigTags = undefined;
    this.sharedMealTag = '';
  }

  private calculateFoodValuesWithPortions() {
    if (this.amountToAddPortions > this.selectedMeal.portions || this.amountToAddPortions < this.selectedMeal.portions) {
      this.selectedMeal.foods.forEach(f => {
        f.energy = (f.energy / this.selectedMeal.portions) * this.amountToAddPortions;
        f.protein = (f.protein / this.selectedMeal.portions) * this.amountToAddPortions;
        f.carbs = (f.carbs / this.selectedMeal.portions) * this.amountToAddPortions;
        f.fat = (f.fat / this.selectedMeal.portions) * this.amountToAddPortions;
        f.fiber = (f.fiber / this.selectedMeal.portions) * this.amountToAddPortions;
        f.sugar = (f.sugar / this.selectedMeal.portions) * this.amountToAddPortions;
        f.amount = (f.amount / this.selectedMeal.portions) * this.amountToAddPortions;
      });
    }
  }

  private calculateFoodValuesWithGrams() {
    // How many percents is amountToAddInGrams from amountTotal
    const percentsOfTotal = (this.amountToAddGrams * 100) / this.amountTotal / 100;
    this.selectedMeal.foods.forEach(f => {
      const amount = f.amount * percentsOfTotal;
      const origFood = this.returnOriginalFoodValues(f.uuid, f.name);
      f.energy = origFood[0].energy * (amount / 100);
      f.protein = origFood[0].protein * (amount / 100);
      f.carbs = origFood[0].carbs * (amount / 100);
      f.fat = origFood[0].fat * (amount / 100);
      f.fiber = origFood[0].fiber * (amount / 100);
      f.sugar = origFood[0].sugar * (amount / 100);
      f.amount = amount;
    });
  }
}
