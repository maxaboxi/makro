import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit {
  private _addedMeals = new BehaviorSubject([]);

  @Input()
  set addedMeals(meal) {
    this._addedMeals.next(meal);
  }

  get addedMeals() {
    return this._addedMeals.getValue();
  }

  constructor() {}

  ngOnInit() {}
}
