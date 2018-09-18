import { Component, OnInit } from '@angular/core';
import { FoodService } from '../../services/food.service';
import { Food } from '../../models/Food';
import { Meal } from '../../models/Meal';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';
import { AddedFoodsService } from '../../services/added-foods.service';

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

  constructor(
    private foodService: FoodService,
    private auth: AuthService,
    private addedFoodService: AddedFoodsService
  ) {}

  ngOnInit() {
    if (localStorage.getItem('loadedDay')) {
      this.addedFoodService._openedSavedMeal.next(true);
    }
    this.auth.isLoggedIn.subscribe(res => {
      this.isLoggedIn = res;
      this.user = this.auth.getUserInfo();
      this.addedFoodService.setMealsFromLocalStorage();
      this.meals = JSON.parse(localStorage.getItem('meals'));
      this.fetchFoods();
      if (this.isLoggedIn) {
        this.auth.checkAdmin();
      }
    });
  }

  fetchFoods() {
    if (this.isLoggedIn) {
      this.foodService
        .getFoodsByUserAndAdmin(this.user.username)
        .subscribe(foods => (this.foods = foods));
    }
    this.foodService.getAllFoods().subscribe(foods => (this.allFoods = foods));
  }
}
