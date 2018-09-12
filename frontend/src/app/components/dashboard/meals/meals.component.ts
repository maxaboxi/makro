import { Component, OnInit, Input } from '@angular/core';
import { Meal } from '../../../models/Meal';
import { AddedFoodsService } from '../../../services/added-foods.service';
import { BehaviorSubject } from 'rxjs';
import { Food } from '../../../models/Food';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit {
  private addedMeals: Meal[];
  private _foods = new BehaviorSubject<Food[]>([]);

  @Input()
  set foods(foods) {
    this._foods.next(foods);
  }

  get foods() {
    return this._foods.getValue();
  }

  constructor(private addedFoodsService: AddedFoodsService) {}

  ngOnInit() {
    this.addedFoodsService._meals.subscribe(meals => (this.addedMeals = meals));
  }
}
