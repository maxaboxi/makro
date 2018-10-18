import { Component, OnInit } from '@angular/core';
import { FoodService } from '../../services/food.service';
import { Food } from '../../models/Food';
import { Meal } from '../../models/Meal';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';
import { AddedFoodsService } from '../../services/added-foods.service';
import { ActivatedRoute } from '@angular/router';
import { DayService } from '../../services/day.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  foods: Food[];
  allFoods: Food[];
  meals: Meal[];
  user: User;
  isLoggedIn = false;
  queryParams = {};

  constructor(
    private foodService: FoodService,
    private dayService: DayService,
    private auth: AuthService,
    private addedFoodService: AddedFoodsService,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe(qp => {
      Object.keys(qp).forEach(param => {
        this.queryParams[param] = qp[param];
      });
    });
  }

  ngOnInit() {
    if (localStorage.getItem('loadedDay')) {
      this.addedFoodService._openedSavedMeal.next(true);
    }
    this.auth.isLoggedIn.subscribe(res => {
      this.isLoggedIn = res;
      this.user = this.auth.getUserInfo();
      if (Object.keys(this.queryParams).length > 0) {
        this.dayService.getSharedDay(this.queryParams['id']).subscribe(res => {
          if (res !== null) {
            localStorage.setItem('meals', JSON.stringify(res['meals']));
          }
        });
      }
      this.setFoods();
    });
  }

  setFoods() {
    this.addedFoodService.setMealsFromLocalStorage();
    this.meals = JSON.parse(localStorage.getItem('meals'));
    this.fetchFoods();
  }

  fetchFoods() {
    if (this.isLoggedIn) {
      this.foodService
        .getFoodsByUserAndAdmin(this.user.username)
        .subscribe(foods => {
          this.foods = foods;
          this.auth.checkAdmin();
        });
    }
    this.foodService.getAllFoods().subscribe(foods => (this.allFoods = foods));
  }
}
