import { Component, OnInit } from '@angular/core';
import { Meal } from '../../../models/Meal';
import { SharedMealsService } from '../../../services/shared-meals.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-admin-meals',
  templateUrl: './admin-meals.component.html',
  styleUrls: ['./admin-meals.component.css']
})
export class AdminMealsComponent implements OnInit {
  sharedMeals: Meal[];
  propertiesToShow = [{ name: 'username', date: false }, { name: 'createdAt', date: true }, { name: 'name', date: false }];
  deletedSharedMeals = [];
  sharedMealsDeleted = false;

  constructor(
    private sharedMealsService: SharedMealsService,
    private flashMessage: FlashMessagesService,
    private modalService: NgbModal,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.sharedMealsService.getAllMeals().subscribe(meals => (this.sharedMeals = meals));
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
          this.sharedMealsService.getAllMeals().subscribe(meals => (this.sharedMeals = meals));
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
}
