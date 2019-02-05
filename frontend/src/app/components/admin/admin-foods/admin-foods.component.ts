import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Food } from '../../../models/Food';
import { FoodService } from '../../../services/food.service';
import { AdminService } from '../../../services/admin.service';
import { EditedFood } from '../../../models/EditedFood';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-foods',
  templateUrl: './admin-foods.component.html',
  styleUrls: ['./admin-foods.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdminFoodsComponent implements OnInit {
  foods: Food[];
  propertiesToShow = [{ name: 'username', date: false }, { name: 'name', date: false }, { name: 'createdAt', date: true }];
  searchTerm = '';
  results: Food[] = [];
  editedFoods: EditedFood[];
  disapprovedEditedFoods: EditedFood[] = [];
  selectedFood: Food = null;
  selectedEditedFood: EditedFood = null;
  deletedFoods = [];
  foodsDeleted = false;
  editedFoodsDisapproved = false;

  constructor(
    private foodService: FoodService,
    private adminService: AdminService,
    private flashMessage: FlashMessagesService,
    private modalService: NgbModal,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.foodService.getAllFoods().subscribe(foods => (this.foods = foods));
    this.adminService.getAllFoodsSentForApproval().subscribe(editedFoods => (this.editedFoods = editedFoods));
  }

  searchFoods() {
    this.results = [];
    const secondaryResults = [];
    const st = this.searchTerm.toLowerCase();
    this.foods.forEach(f => {
      const fLc = f.name.toLowerCase();
      if (fLc === st) {
        this.results.push(f);
      } else if (st === fLc.slice(0, st.length)) {
        this.results.push(f);
      } else {
        const containsWhitespaces = fLc.indexOf(' ') > 1;
        const containsBrackets = fLc.indexOf('(') > 1;
        if (containsWhitespaces && !containsBrackets) {
          for (let i = 0; i < fLc.length; i++) {
            if (st.length > 1 && fLc[i] === ' ' && fLc.slice(i + 1, i + 1 + st.length) === st) {
              secondaryResults.push(f);
            }
          }
        }
        if (containsWhitespaces && containsBrackets) {
          for (let i = 0; i < fLc.length; i++) {
            if (st.length > 1 && fLc[i] === '(' && fLc.slice(i + 1, i + 1 + st.length) === st) {
              secondaryResults.push(f);
            }
          }
        }
      }
    });

    if (secondaryResults.length > 0) {
      this.results = this.results.concat(secondaryResults);
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
                this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
                  cssClass: 'alert-success',
                  timeout: 2000
                });
                this.foodService.getAllFoods().subscribe(foods => (this.foods = foods));
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

  deleteFood(index) {
    if (this.results.length === 0 && this.searchTerm.length === 0) {
      this.deletedFoods.push(this.foods[index]._id);
      this.foods.splice(index, 1);
    } else {
      this.deletedFoods.push(this.results[index]._id);
      this.results.splice(index, 1);
    }
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
        this.foodService.getAllFoods().subscribe(foods => (this.foods = foods));
      },
      (error: Error) => {
        this.flashMessage.show(error['error'].msg, {
          cssClass: 'alert-danger',
          timeout: 2000
        });
      }
    );
  }

  openEditedFoodModal(content, editedFood) {
    this.selectedEditedFood = editedFood;
    this.modalService.open(content, { centered: true, size: 'lg' }).result.then(
      result => {
        if (result === 'save') {
          this.adminService.approveEditedFood(editedFood).subscribe(
            res => {
              if (res['success']) {
                this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
                  cssClass: 'alert-success',
                  timeout: 2000
                });
                this.adminService.getAllFoodsSentForApproval().subscribe(foods => (this.editedFoods = foods));
                this.selectedEditedFood = null;
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
        this.selectedEditedFood = null;
      },
      dismissed => {
        this.selectedFood = null;
      }
    );
  }

  disapproveEditedFood(index: number, editedFood: EditedFood) {
    this.disapprovedEditedFoods.push(editedFood);
    this.editedFoods.splice(index, 1);
    this.editedFoodsDisapproved = true;
  }

  deleteEditedFoodsFromDb() {
    this.adminService.disapproveEditedFoods(this.disapprovedEditedFoods).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.deletedFoods = [];
          this.foodsDeleted = false;
          this.editedFoodsDisapproved = false;
          this.adminService.getAllFoodsSentForApproval().subscribe(foods => (this.editedFoods = foods));
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
