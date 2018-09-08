import { Component, OnInit } from '@angular/core';
import { FoodService } from '../../services/food.service';
import { Food } from '../../models/Food';
import { Meal } from '../../models/Meal';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';

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

  constructor(private foodService: FoodService, private auth: AuthService) {}

  ngOnInit() {
    this.user = this.auth.getUserInfo();
    this.meals = this.user.meals;
    this.fetchFoods();
  }

  fetchFoods() {
    this.foodService
      .getFoods(this.user.username)
      .subscribe(foods => (this.foods = foods));
    this.foodService.getAllFoods().subscribe(foods => (this.allFoods = foods));
  }
}
