import { Component, OnInit, OnDestroy } from '@angular/core';
import { FoodService } from '../../services/food.service';
import { Food } from '../../models/Food';
import { Meal } from '../../models/Meal';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';
import { AddedFoodsService } from '../../services/added-foods.service';
import { ActivatedRoute } from '@angular/router';
import { DayService } from '../../services/day.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  foods: Food[];
  allFoods: Food[];
  meals: Meal[];
  user: User;
  isLoggedIn = false;
  queryParams = {};
  loading = true;
  showSearch = true;

  private subscriptions = new Subscription();

  constructor(
    private foodService: FoodService,
    private dayService: DayService,
    private auth: AuthService,
    private addedFoodService: AddedFoodsService,
    private route: ActivatedRoute
  ) {
    this.subscriptions.add(
      this.route.queryParams.subscribe(qp => {
        Object.keys(qp).forEach(param => {
          this.queryParams[param] = qp[param];
        });
      })
    );
  }

  ngOnInit() {
    if (localStorage.getItem('loadedDay')) {
      this.addedFoodService._openedSavedMeal.next(true);
      this.dayService.loadedDayName.next(JSON.parse(localStorage.getItem('loadedDay')).name);
    }
    this.subscriptions.add(
      this.auth.isLoggedIn.subscribe(res => {
        this.isLoggedIn = res;
        this.user = this.auth.getUserInfo();
        this.setFoods();
        if (Object.keys(this.queryParams).length > 0) {
          this.subscriptions.add(
            this.dayService.getSharedDay(this.queryParams['id']).subscribe(
              res => {
                if (res !== null) {
                  localStorage.setItem('meals', JSON.stringify(res));
                  this.addedFoodService.setMeals(res);
                  this.addedFoodService.setTotals();
                }
              },
              (error: Error) => console.log(error)
            )
          );
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setFoods() {
    this.addedFoodService.setMealsFromLocalStorage();
    this.meals = JSON.parse(localStorage.getItem('meals'));
    this.fetchFoods();
  }

  fetchFoods() {
    this.foodService.getAllFoods();
    this.loading = true;
    if (this.isLoggedIn) {
      this.foodService.getFoodsExcludeOtherUsers();
      this.subscriptions.add(
        this.foodService.excludedFoods.subscribe(foods => {
          this.foods = foods;
          this.auth.checkAdmin();
        })
      );
    }
    this.subscriptions.add(
      this.foodService.allFoods.subscribe(foods => {
        this.allFoods = foods;
        this.loading = false;
      })
    );
  }
}
