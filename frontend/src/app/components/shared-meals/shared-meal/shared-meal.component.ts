import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Meal } from '../../../models/Meal';
import { User } from '../../../models/User';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddedFoodsService } from '../../../services/added-foods.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) {}

  ngOnInit() {
    this.meal.foods.forEach(f => {
      this.amountTotal += f.amount;
      this.kcalTotal += f.energia;
      this.proteinTotal += f.proteiini;
      this.carbTotal += f.hh;
      this.fatTotal += f.rasva;
    });
  }

  openAddMealModal(content, meal) {
    this.selectedMeal = meal;
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          const mealsFromLocalStorage: Meal[] = JSON.parse(
            localStorage.getItem('meals')
          );

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
}
