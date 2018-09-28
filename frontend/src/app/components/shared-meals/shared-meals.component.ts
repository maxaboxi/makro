import { Component, OnInit } from '@angular/core';
import { SharedMealsService } from '../../services/shared-meals.service';
import { Meal } from '../../models/Meal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddedFoodsService } from '../../services/added-foods.service';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-shared-meals',
  templateUrl: './shared-meals.component.html',
  styleUrls: ['./shared-meals.component.css']
})
export class SharedMealsComponent implements OnInit {
  sharedMealsFirst: Meal[];
  sharedMealsSecond: Meal[];
  selectedMeal = '';
  user: User;

  constructor(
    private auth: AuthService,
    private sharedMealService: SharedMealsService,
    private modalService: NgbModal,
    private addedFoodsService: AddedFoodsService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => (this.user = user));
    this.sharedMealService.getAllMeals().subscribe(meals => {
      if (meals.length % 2 === 0) {
        this.sharedMealsFirst = meals.splice(0, Math.floor(meals.length / 2));
      } else {
        this.sharedMealsFirst = meals.splice(
          0,
          Math.floor(meals.length / 2) + 1
        );
      }
      this.sharedMealsSecond = meals;
    });
  }

  openAddMealModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
        } else {
          this.selectedMeal = '';
        }
      },
      dismissed => {
        this.selectedMeal = '';
      }
    );
  }

  addMeal(meal) {}
}
