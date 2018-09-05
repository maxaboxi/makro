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

  addToMeals(e) {
    const food: Food = {
      name: e.food.name,
      energia: e.food.energia * (e.amount / 100),
      proteiini: e.food.proteiini * (e.amount / 100),
      hh: e.food.hh * (e.amount / 100),
      rasva: e.food.rasva * (e.amount / 100),
      kuitu: e.food.kuitu * (e.amount / 100),
      sokeri: e.food.sokeri * (e.amount / 100),
      amount: e.amount
    };
    this.meals.forEach(m => {
      if (m.name === e.meal) {
        m.foods.push(food);
      }
    });
  }
}
