import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Meal } from '../../../models/Meal';
import { User } from '../../../models/User';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddedFoodsService } from '../../../services/added-foods.service';
import { Router } from '@angular/router';
import { Like } from '../../../models/Like';
import { LikeService } from '../../../services/like.service';
import { ConnectionService } from '../../../services/connection.service';

@Component({
  selector: 'app-shared-meal',
  templateUrl: './shared-meal.component.html',
  styleUrls: ['./shared-meal.component.css']
})
export class SharedMealComponent implements OnInit {
  private _meal = new BehaviorSubject<Meal>(null);
  private _user = new BehaviorSubject<User>(null);
  amountTotal = 0;
  kcalTotal = 0;
  proteinTotal = 0;
  carbTotal = 0;
  fatTotal = 0;
  selectedMeal: Meal;
  addToMeal = '';
  showRecipe = false;
  userLike = 0;
  votesFetched = false;
  loading = true;
  online;
  amountToAddPortions = 0;

  @Input()
  set meal(meal) {
    this._meal.next(meal);
  }

  get meal() {
    return this._meal.getValue();
  }

  @Input()
  set user(user) {
    this._user.next(user);
  }

  get user() {
    return this._user.getValue();
  }

  constructor(
    private modalService: NgbModal,
    private addedFoodsService: AddedFoodsService,
    private likeService: LikeService,
    private router: Router,
    private connectionService: ConnectionService
  ) {}

  ngOnInit() {
    this.connectionService.monitor().subscribe(res => (this.online = res));
    this.userLike = this.meal.userLike;
    this.meal.foods.forEach(f => {
      this.amountTotal += f.amount;
      this.kcalTotal += f.energy;
      this.proteinTotal += f.protein;
      this.carbTotal += f.carbs;
      this.fatTotal += f.fat;
    });
    this.loading = false;
  }

  openAddMealModal(content, meal: Meal) {
    this.selectedMeal = meal;
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          const mealsFromLocalStorage: Meal[] = JSON.parse(localStorage.getItem('meals'));
          if (this.amountToAddPortions && this.selectedMeal.portions) {
            this.calculateFoodValuesWithPortions();
          }
          for (let m of mealsFromLocalStorage) {
            if (m.name === this.addToMeal) {
              m.foods = this.selectedMeal.foods;
              break;
            }
          }
          localStorage.setItem('meals', JSON.stringify(mealsFromLocalStorage));
          this.addedFoodsService.setMealsFromLocalStorage();
          this.router.navigate(['/']);
        }
        this.addToMeal = '';
        this.selectedMeal = undefined;
      },
      dismissed => {
        this.addToMeal = '';
        this.selectedMeal = undefined;
      }
    );
  }

  toggleShowRecipe() {
    this.showRecipe = !this.showRecipe;
  }

  like(c: number) {
    let like: Like = {
      userUUID: this.user.uuid,
      sharedMealUUID: this.meal.uuid,
      value: c
    };
    if (this.userLike === 0) {
      this.likeService.likePost(like).subscribe(res => {
        if (res['success']) {
          this.meal.totalPoints += like.value;
          this.userLike = c;
        }
      });
    } else {
      this.likeService.replacePreviousLike(like, like.sharedMealUUID).subscribe(res => {
        if (res['success']) {
          this.meal.totalPoints += like.value;
          this.meal.totalPoints += like.value;
          this.userLike = c;
        }
      });
    }
  }

  private calculateFoodValuesWithPortions() {
    if (this.amountToAddPortions > this.selectedMeal.portions || this.amountToAddPortions < this.selectedMeal.portions) {
      this.selectedMeal.foods.forEach(f => {
        f.energy = (f.energy / this.selectedMeal.portions) * this.amountToAddPortions;
        f.protein = (f.protein / this.selectedMeal.portions) * this.amountToAddPortions;
        f.carbs = (f.carbs / this.selectedMeal.portions) * this.amountToAddPortions;
        f.fat = (f.fat / this.selectedMeal.portions) * this.amountToAddPortions;
        f.fiber = (f.fiber / this.selectedMeal.portions) * this.amountToAddPortions;
        f.sugar = (f.sugar / this.selectedMeal.portions) * this.amountToAddPortions;
        f.amount = (f.amount / this.selectedMeal.portions) * this.amountToAddPortions;
      });
    }
  }
}
