import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-added-foods',
  templateUrl: './added-foods.component.html',
  styleUrls: ['./added-foods.component.css']
})
export class AddedFoodsComponent implements OnInit {
  private _addedFoods = new BehaviorSubject([]);

  @Input()
  set addedFoods(foods) {
    this._addedFoods.next(foods);
  }

  get addedFoods() {
    return this._addedFoods.getValue();
  }

  constructor() {}

  ngOnInit() {}
}
