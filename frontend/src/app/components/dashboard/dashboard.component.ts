import { Component, OnInit } from '@angular/core';
import { FoodService } from '../../services/food.service';
import { Food } from '../../models/Food';
import { Meal } from '../../models/Meal';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  foods: Food[];
  meals: Meal[];

  constructor(private foodService: FoodService, private auth: AuthService) {}

  ngOnInit() {
    this.foodService.getFoods().subscribe(foods => (this.foods = foods));
    const user = this.auth.getUserInfo();
    this.meals = user.meals;
  }
}
