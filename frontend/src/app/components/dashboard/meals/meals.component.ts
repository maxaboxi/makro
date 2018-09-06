import { Component, OnInit, Input } from '@angular/core';
import { Meal } from '../../../models/Meal';
import { AddedFoodsService } from '../../../services/added-foods.service';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit {
  private addedMeals: Meal[];

  constructor(private addedFoodsService: AddedFoodsService) {}

  ngOnInit() {
    this.addedFoodsService._meals.subscribe(meals => (this.addedMeals = meals));
  }
}
