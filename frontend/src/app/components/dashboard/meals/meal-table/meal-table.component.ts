import {
  Component,
  OnInit,
  Input,
  DoCheck,
  IterableDiffers
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-meal-table',
  templateUrl: './meal-table.component.html',
  styleUrls: ['./meal-table.component.css']
})
export class MealTableComponent implements OnInit, DoCheck {
  private _meal = new BehaviorSubject([]);
  private energyTotal = 0;
  private proteinTotal = 0;
  private carbTotal = 0;
  private fatTotal = 0;
  private amountTotal = 0;
  private iterableDiffer;

  @Input()
  set meal(meal) {
    this._meal.next(meal);
  }

  get meal() {
    return this._meal.getValue();
  }

  constructor(private _iterableDiffers: IterableDiffers) {
    this.iterableDiffer = this._iterableDiffers.find([]).create(null);
  }

  ngDoCheck() {
    let changes = this.iterableDiffer.diff(this.meal['foods']);
    if (changes) {
      this.energyTotal = 0;
      this.proteinTotal = 0;
      this.carbTotal = 0;
      this.fatTotal = 0;
      this.amountTotal = 0;
      changes.collection.forEach(f => {
        this.energyTotal += f.energia;
        this.proteinTotal += f.proteiini;
        this.carbTotal += f.hh;
        this.fatTotal += f.rasva;
        this.amountTotal += f.amount;
      });
    }
  }

  ngOnInit() {}
}
