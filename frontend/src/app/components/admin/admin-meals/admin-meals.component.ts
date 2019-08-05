import { Component, OnInit } from '@angular/core';
import { Meal } from '../../../models/Meal';
import { SharedMealsService } from '../../../services/shared-meals.service';
import { TranslateService } from '@ngx-translate/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-meals',
  templateUrl: './admin-meals.component.html',
  styleUrls: ['./admin-meals.component.css']
})
export class AdminMealsComponent implements OnInit {
  createdMeals: Meal[];
  propertiesToShow = [{ name: 'username', date: false }, { name: 'createdAt', date: true }, { name: 'name', date: false }];
  deletedcreatedMeals = [];
  createdMealsDeleted = false;

  constructor(
    private sharedMealsService: SharedMealsService,
    private flashMessage: FlashMessagesService,
    private translator: TranslateService,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.adminService.getAllCreatedMeals().subscribe(meals => (this.createdMeals = meals));
  }

  deleteCreatedMeal(index: number) {
    this.deletedcreatedMeals.push(this.createdMeals[index].uuid);
    this.createdMeals.splice(index, 1);

    this.createdMealsDeleted = true;
  }

  deleteCreatedMealsFromDb() {
    this.sharedMealsService.removeMeals(this.deletedcreatedMeals).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.adminService.getAllCreatedMeals().subscribe(meals => (this.createdMeals = meals));
          this.createdMealsDeleted = false;
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
