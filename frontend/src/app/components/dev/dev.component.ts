import { Component, OnInit } from '@angular/core';
import { FoodService } from '../../services/food.service';
import { Food } from '../../models/Food';
import { TranslateService } from '@ngx-translate/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditedFood } from '../../models/EditedFood';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-dev',
  templateUrl: './dev.component.html',
  styleUrls: ['./dev.component.css']
})
export class DevComponent implements OnInit {
  user: User;
  allFoods: Food[];
  duplicateFoods: Food[] = [];
  loading = true;
  findingDuplicates = false;
  editedAndDeletedFoods: EditedFood[] = [];
  editedAndDeletedDuplicateFoods: EditedFood[] = [];
  translatedFoods: EditedFood[] = [];
  results = [];
  searchTerm = '';
  selectedFood: Food;

  constructor(
    private foodService: FoodService,
    private translator: TranslateService,
    private flashMessage: FlashMessagesService,
    private modalService: NgbModal,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => (this.user = user));
    this.getAllFoods();
  }

  getAllFoods() {
    this.allFoods = [];
    this.duplicateFoods = [];
    this.loading = true;
    this.foodService.getAllFoods().subscribe(
      foods => {
        this.allFoods = foods;
        this.loading = false;
        this.findDuplicateFoods();
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

  findDuplicateFoods() {
    this.findingDuplicates = true;
    let temp = {};

    this.allFoods.map(food => {
      const propertyName = food.name.toLowerCase();
      if (propertyName in temp) {
        this.allFoods.forEach(f => {
          if (f.name.toLowerCase() === propertyName) {
            this.duplicateFoods.push(f);
          }
        });
      } else {
        temp[propertyName] = food.name.toLowerCase();
      }
    });
    this.findingDuplicates = false;
  }

  searchFoods() {
    this.results = [];
    const secondaryResults = [];
    const st = this.searchTerm.toLowerCase();
    this.allFoods.forEach(f => {
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

  markForDeletion(array: string) {
    if (array === 'duplicate') {
      this.editedAndDeletedDuplicateFoods.push({ editedBy: this.user.username, editedFood: { ...this.selectedFood }, deleted: true });
    } else {
      this.editedAndDeletedFoods.push({ editedBy: this.user.username, editedFood: { ...this.selectedFood }, deleted: true });
    }
    this.selectedFood = null;
  }

  openDeleteFoodModal(content, food: Food, array: string) {
    this.selectedFood = food;
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.selectedFood.waitingForApproval = true;
          this.markForDeletion(array);
        }
      },
      dismissed => {
        this.selectedFood = null;
      }
    );
  }

  openFoodModal(content, food, duplicate: boolean) {
    const originalFood = { ...food };
    this.selectedFood = food;
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.selectedFood.waitingForApproval = true;
          const editedFood: EditedFood = {
            editedBy: this.user.username,
            originalFood: originalFood,
            editedFood: { ...this.selectedFood }
          };
          if (duplicate) {
            this.editedAndDeletedDuplicateFoods.push(editedFood);
          } else {
            this.editedAndDeletedFoods.push(editedFood);
          }
        }
        this.selectedFood = null;
      },
      dismissed => {
        this.selectedFood = null;
      }
    );
  }

  openTranslateFoodModal(content, food) {
    const originalFood = food;
    this.selectedFood = food;
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.selectedFood.waitingForApproval = true;
          this.selectedFood.reasonForEditing = 'Translation added';
          const editedFood: EditedFood = {
            editedBy: this.user.username,
            originalFood: originalFood,
            editedFood: { ...this.selectedFood }
          };
          this.translatedFoods.push(editedFood);
        }
        this.selectedFood = null;
      },
      dismissed => {
        this.selectedFood = null;
      }
    );
  }

  sentFoodsForApproval(arrayToSent) {
    let selectedArray;
    if (arrayToSent === 'duplicate') {
      selectedArray = this.editedAndDeletedDuplicateFoods;
    } else if (arrayToSent === 'translated') {
      selectedArray = this.translatedFoods;
    } else {
      selectedArray = this.editedAndDeletedFoods;
    }
    this.foodService.sentForApproval(selectedArray).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(this.translator.instant('FOODS_SENT_FOR_APPROVAL'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          if (arrayToSent === 'duplicate') {
            this.editedAndDeletedDuplicateFoods = [];
          } else if (arrayToSent === 'translated') {
            this.translatedFoods = [];
          } else {
            this.editedAndDeletedFoods = [];
          }
          this.getAllFoods();
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