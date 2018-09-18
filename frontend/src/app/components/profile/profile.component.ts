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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;
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

  constructor(
    private auth: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private modalService: NgbModal,
    private dayService: DayService,
    private addedFoodsService: AddedFoodsService,
    private foodService: FoodService
  ) {}

  ngOnInit() {
    this.auth.fetchUserInfo().subscribe(res => {
      this.user = JSON.parse(JSON.stringify(res['user']));
      this.calculateBaseExpenditure();
      this.dayService.getAllSavedDays(this.user.username).subscribe(days => {
        this.sortSavedDays(days);
        this.foodService
          .getFoodsAddedByUser(this.user.username)
          .subscribe(foods => this.sortUserAddedFoods(foods));
      });
    });
  }

  sortSavedDays(days) {
    if (days.length <= 10) {
      this.daysSplit = false;
      this.savedDays = days;
    } else {
      this.daysSplit = true;
      this.savedDaysFirst = days.slice(0, Math.floor(days.length / 2));
      this.savedDaysSecond = days.slice(Math.floor(days.length / 2) + 1);
    }
  }

  sortUserAddedFoods(foods) {
    if (foods.length <= 10) {
      this.foodsSplit = false;
      this.userAddedFoods = foods;
    } else {
      this.foodsSplit = true;
      this.userAddedFoodsFirst = foods.slice(0, Math.floor(foods.length / 2));
      this.userAddedFoodsSecond = foods.slice(Math.floor(foods.length / 2) + 1);
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
