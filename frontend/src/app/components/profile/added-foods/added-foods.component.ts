import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/User';
import { Food } from '../../../models/Food';
import { FoodService } from '../../../services/food.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-added-foods',
  templateUrl: './added-foods.component.html',
  styleUrls: ['./added-foods.component.css']
})
export class AddedFoodsComponent implements OnInit {
  user: User;
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
    private modalService: NgbModal,
    private foodService: FoodService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user = user;
      if (user.username) {
        this.foodService
          .getFoodsAddedByUser(this.user.username)
          .subscribe(foods => {
            this.sortUserAddedFoods(foods);
          });
      }
    });
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
}
