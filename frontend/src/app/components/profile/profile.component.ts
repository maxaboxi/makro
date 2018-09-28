import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from '../../models/User';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Day } from '../../models/Day';
import { DayService } from '../../services/day.service';
import { AddedFoodsService } from '../../services/added-foods.service';
import { FoodService } from '../../services/food.service';
import { Food } from '../../models/Food';
import { Meal } from '../../models/Meal';
import { SharedMealsService } from '../../services/shared-meals.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;
  allFoods: Food[];
  showInfo = false;
  changed = false;
  daysDeleted = false;
  showDeleteAccount = false;
  savedDays: Day[] = [];
  savedDaysFirst: Day[] = [];
  savedDaysSecond: Day[] = [];
  daysSplit = false;
  deletedDays = [];
  selectedFood: Food;
  userAddedFoods: Food[] = [];
  userAddedFoodsFirst: Food[] = [];
  userAddedFoodsSecond: Food[] = [];
  foodsSplit = false;
  deletedFoods = [];
  foodsDeleted = false;
  sharedMeals: Meal[] = [];
  sharedMealsFirst: Meal[] = [];
  sharedMealsSecond: Meal[] = [];
  sharedMealsSplit = false;
  deletedSharedMeals = [];
  sharedMealsDeleted = false;
  selectedSharedMeal: Meal;
  selectedSharedMealOrigFoods: Food[];
  newUserPassword;
  newUserPasswordAgain;

  constructor(
    private auth: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private modalService: NgbModal,
    private dayService: DayService,
    private addedFoodsService: AddedFoodsService,
    private foodService: FoodService,
    private sharedMealsService: SharedMealsService
  ) {}

  ngOnInit() {
    this.auth.fetchUserInfo().subscribe(res => {
      this.user = JSON.parse(JSON.stringify(res['user']));
      this.calculateBaseExpenditure();
      this.dayService.getAllSavedDays(this.user.username).subscribe(days => {
        this.sortSavedDays(days);
        this.sharedMealsService
          .getMealsByUser(this.user.username)
          .subscribe(meals => {
            this.sortSharedMeals(meals);
            this.foodService
              .getFoodsAddedByUser(this.user.username)
              .subscribe(foods => {
                this.sortUserAddedFoods(foods);
                this.foodService
                  .getAllFoods()
                  .subscribe(foods => (this.allFoods = foods));
              });
          });
      });
    });
  }

  sortSavedDays(days) {
    if (days.length <= 10) {
      this.daysSplit = false;
      this.savedDays = days;
    } else {
      this.daysSplit = true;
      if (days.length % 2 === 0) {
        this.savedDaysFirst = days.splice(0, Math.floor(days.length / 2));
      } else {
        this.savedDaysFirst = days.splice(0, Math.floor(days.length / 2) + 1);
      }
      this.savedDaysSecond = days;
    }
  }

  sortUserAddedFoods(foods) {
    if (foods.length <= 10) {
      this.foodsSplit = false;
      this.userAddedFoods = foods;
    } else {
      this.foodsSplit = true;
      if (foods.length % 2 === 0) {
        this.userAddedFoodsFirst = foods.splice(
          0,
          Math.floor(foods.length / 2)
        );
      } else {
        this.userAddedFoodsFirst = foods.splice(
          0,
          Math.floor(foods.length / 2) + 1
        );
      }
      this.userAddedFoodsSecond = foods;
    }
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

  calculateBaseExpenditure() {
    if (
      this.user.height !== 0 &&
      this.user.weight !== 0 &&
      this.user.age !== 0 &&
      this.user.sex !== null &&
      this.user.activity >= 1
    ) {
      if (this.user.sex == 'mies') {
        this.user.dailyExpenditure =
          88.4 +
          13.4 * this.user.weight +
          4.8 * this.user.height -
          5.7 * this.user.age;
      } else {
        this.user.dailyExpenditure =
          447.6 +
          9.25 * this.user.weight +
          3.1 * this.user.height -
          4.3 * this.user.age;
      }
      this.user.dailyExpenditure *= this.user.activity;
    }
  }

  toggleInfo() {
    this.showInfo = !this.showInfo;
  }

  addNewMeal() {
    this.user.meals.push({
      name: 'Ateria ' + (this.user.meals.length + 1),
      foods: []
    });
    this.changed = true;
  }

  deleteMeal(index) {
    this.user.meals.splice(index, 1);
    this.changed = true;
  }

  updateInfo() {
    this.user.meals.forEach((m, i) => {
      if (m.name.length === 0) {
        m.name = 'Ateria ' + (i + 1);
      }
    });
    const userInfo: User = {
      username: this.user.username,
      email: this.user.email,
      age: this.user.age,
      height: this.user.height,
      weight: this.user.weight,
      activity: this.user.activity,
      sex: this.user.sex,
      dailyExpenditure: this.user.dailyExpenditure,
      userAddedExpenditure: this.user.userAddedExpenditure,
      userAddedProteinTarget: this.user.userAddedProteinTarget,
      userAddedCarbTarget: this.user.userAddedCarbTarget,
      userAddedFatTarget: this.user.userAddedFatTarget,
      meals: this.user.meals
    };
    this.auth.updateUserInfo(userInfo).subscribe(
      res => {
        if (res) {
          this.changed = false;
          this.auth.setUserInfo(res['user']);
          this.user = this.auth.getUserInfo();
          this.calculateBaseExpenditure();
          this.flashMessage.show('Tiedot päivitetty', {
            cssClass: 'alert-success',
            timeout: 2000
          });
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

  loadDay(index, array) {
    if (array === 'savedDays') {
      localStorage.setItem(
        'meals',
        JSON.stringify(this.savedDays[index].meals)
      );
      localStorage.setItem(
        'loadedDay',
        JSON.stringify(this.savedDays[index]._id)
      );
    }

    if (array === 'savedDaysFirst') {
      localStorage.setItem(
        'meals',
        JSON.stringify(this.savedDaysFirst[index].meals)
      );
      localStorage.setItem(
        'loadedDay',
        JSON.stringify(this.savedDaysFirst[index]._id)
      );
    }

    if (array === 'savedDaysSecond') {
      localStorage.setItem(
        'meals',
        JSON.stringify(this.savedDaysSecond[index].meals)
      );
      localStorage.setItem(
        'loadedDay',
        JSON.stringify(this.savedDaysSecond[index]._id)
      );
    }
    this.addedFoodsService._mealsEdited.next(false);
    this.addedFoodsService._openedSavedMeal.next(true);
    this.addedFoodsService.setMealsFromLocalStorage();
    this.router.navigate(['/']);
  }

  deleteDay(index, array) {
    if (array === 'savedDays') {
      this.deletedDays.push(this.savedDays[index]._id);
      this.savedDays.splice(index, 1);
    }

    if (array === 'savedDaysFirst') {
      this.deletedDays.push(this.savedDaysFirst[index]._id);
      this.savedDaysFirst.splice(index, 1);
    }

    if (array === 'savedDaysSecond') {
      this.deletedDays.push(this.savedDaysSecond[index]._id);
      this.savedDaysSecond.splice(index, 1);
    }

    this.daysDeleted = true;
  }

  deleteDaysFromDb() {
    this.dayService.removeDays(this.deletedDays).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show('Muutokset tallennettu.', {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.dayService
            .getAllSavedDays(this.user.username)
            .subscribe(days => {
              this.sortSavedDays(days);
            });
          this.daysDeleted = false;
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
            .subscribe(days => {
              this.sortSharedMeals(days);
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

  selectFood(index, array) {
    if (array === 'userAddedFoods') {
      this.selectedFood = this.userAddedFoods[index];
    }

    if (array === 'userAddedFoodsFirst') {
      this.selectedFood = this.userAddedFoodsFirst[index];
    }

    if (array === 'userAddedFoodsSecond') {
      this.selectedFood = this.userAddedFoodsSecond[index];
    }
  }

  deleteFood(index, array) {
    if (array === 'userAddedFoods') {
      this.deletedFoods.push(this.userAddedFoods[index]._id);
      this.userAddedFoods.splice(index, 1);
    }

    if (array === 'userAddedFoodsFirst') {
      this.deletedFoods.push(this.userAddedFoodsFirst[index]._id);
      this.userAddedFoodsFirst.splice(index, 1);
    }

    if (array === 'userAddedFoodsSecond') {
      this.deletedFoods.push(this.userAddedFoodsSecond[index]._id);
      this.userAddedFoodsSecond.splice(index, 1);
    }

    this.foodsDeleted = true;
  }

  deleteFoodsFromDb() {
    this.foodService.removeFoods(this.deletedFoods).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show('Muutokset tallennettu', {
            cssClass: 'alert-success',
            timeout: 2000
          });
        }
        this.deletedFoods = [];
        this.foodsDeleted = false;
        this.foodService
          .getFoodsAddedByUser(this.user.username)
          .subscribe(foods => {
            this.sortUserAddedFoods(foods);
          });
      },
      (error: Error) => {
        this.flashMessage.show(error['error'].msg, {
          cssClass: 'alert-danger',
          timeout: 2000
        });
      }
    );
  }

  openModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.updateInfo();
        } else {
          this.user = this.auth.getUserInfo();
          this.changed = false;
        }
      },
      dismissed => {
        this.user = this.auth.getUserInfo();
        this.changed = false;
      }
    );
  }

  openDayModal(content) {
    const originalDays = JSON.parse(JSON.stringify(this.savedDays));
    const changedDays = [];
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.savedDays.forEach((d, i) => {
            if (d.name !== originalDays[i].name) {
              changedDays.push(d);
            }
          });
          this.dayService.updateDayNames(changedDays).subscribe(
            res => {
              if (res['success']) {
                this.flashMessage.show('Muutokset tallennettu', {
                  cssClass: 'alert-success',
                  timeout: 2000
                });
                this.dayService
                  .getAllSavedDays(this.user.username)
                  .subscribe(days => {
                    this.sortSavedDays(days);
                  });
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
          this.savedDays = JSON.parse(JSON.stringify(originalDays));
        }
      },
      dismissed => {
        this.savedDays = JSON.parse(JSON.stringify(originalDays));
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

  openFoodModal(content, food) {
    this.selectedFood = food;
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.foodService.editFood(this.selectedFood).subscribe(
            res => {
              if (res['success']) {
                this.flashMessage.show('Muutokset tallennettu', {
                  cssClass: 'alert-success',
                  timeout: 2000
                });
                this.foodService
                  .getFoodsAddedByUser(this.user.username)
                  .subscribe(foods => {
                    this.sortUserAddedFoods(foods);
                  });
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
        this.selectedFood = null;
      },
      dismissed => {
        this.selectedFood = null;
      }
    );
  }

  openChangePasswordModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          if (this.newUserPassword !== this.newUserPasswordAgain) {
            this.flashMessage.show(
              'Salasanat eivät täsmänneet. Salasanaa ei vaihdettu.',
              {
                cssClass: 'alert-danger',
                timeout: 2000
              }
            );
          } else {
            const user = {
              _id: this.user._id,
              password: this.newUserPassword
            };
            this.auth.changePassword(user).subscribe(
              res => {
                if (res['success']) {
                  this.flashMessage.show('Salasana vaihdettu', {
                    cssClass: 'alert-success',
                    timeout: 2000
                  });
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
        }
        this.newUserPassword = null;
        this.newUserPasswordAgain = null;
      },
      dismissed => {
        this.newUserPassword = null;
        this.newUserPasswordAgain = null;
      }
    );
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.auth.isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  toggleDelete() {
    this.showDeleteAccount = !this.showDeleteAccount;
  }

  deleteAccount() {
    if (
      confirm(
        'Oletko varma, että haluat poistaa käyttäjätilisi? Tilin mukana poistetaan myös kaikki tallentamasi tieto paitsi lisäämäsi ruoat. Tilin poistoa ei voi perua.'
      )
    ) {
      this.auth.deleteAccount().subscribe(
        success => {
          this.flashMessage.show('Tili poistettu.', {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.logout();
        },
        (error: Error) => {
          this.flashMessage.show(error['error'].msg, {
            cssClass: 'alert-danger',
            timeout: 2000
          });
        }
      );
    } else {
      this.showDeleteAccount = false;
    }
  }
}
