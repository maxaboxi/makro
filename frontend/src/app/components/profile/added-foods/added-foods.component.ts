import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/User';
import { Food } from '../../../models/Food';
import { FoodService } from '../../../services/food.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-added-foods',
  templateUrl: './added-foods.component.html',
  styleUrls: ['./added-foods.component.css']
})
export class AddedFoodsComponent implements OnInit {
  user: User;
  selectedFood: Food;
  userAddedFoods: Food[] = [];
  deletedFoods = [];
  foodsDeleted = false;
  loading = true;

  constructor(
    private auth: AuthService,
    private flashMessage: FlashMessagesService,
    private modalService: NgbModal,
    private foodService: FoodService,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user = user;
      if (user.username) {
        this.foodService.getFoodsAddedByUser(this.user.username).subscribe(
          foods => {
            this.userAddedFoods = foods;
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
    });
  }

  selectFood(index) {
    this.selectedFood = this.userAddedFoods[index];
  }

  deleteFood(index) {
    this.deletedFoods.push(this.userAddedFoods[index]._id);
    this.userAddedFoods.splice(index, 1);
    this.foodsDeleted = true;
  }

  deleteFoodsFromDb() {
    this.foodService.removeFoods(this.deletedFoods).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
        }
        this.deletedFoods = [];
        this.foodsDeleted = false;
        this.foodService.getFoodsAddedByUser(this.user.username).subscribe(foods => {
          this.userAddedFoods = foods;
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
                this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
                  cssClass: 'alert-success',
                  timeout: 2000
                });
                this.foodService.getFoodsAddedByUser(this.user.username).subscribe(foods => {
                  this.userAddedFoods = foods;
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
