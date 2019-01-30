import { Component, OnInit } from '@angular/core';
import { FoodService } from '../../services/food.service';
import { Food } from '../../models/Food';
import { TranslateService } from '@ngx-translate/core';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-dev',
  templateUrl: './dev.component.html',
  styleUrls: ['./dev.component.css']
})
export class DevComponent implements OnInit {
  allFoods: Food[];
  duplicateFoods: Food[] = [];
  loading = true;
  findingDuplicates = false;
  editedAndDeletedFoods: Food[] = [];
  editedFoods: Food[] = [];
  deletedFoods: Food[] = [];

  constructor(private foodService: FoodService, private translator: TranslateService, private flashMessage: FlashMessagesService) {}

  ngOnInit() {
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
}
