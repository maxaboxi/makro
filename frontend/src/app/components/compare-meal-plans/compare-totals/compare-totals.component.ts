import { Component, OnInit, Input } from '@angular/core';
import { Totals } from 'src/app/models/Totals';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-compare-totals',
  templateUrl: './compare-totals.component.html',
  styleUrls: ['./compare-totals.component.css']
})
export class CompareTotalsComponent implements OnInit {
  private _totals = new BehaviorSubject<Totals>(null);

  @Input()
  set totals(totals: Totals) {
    this._totals.next(totals);
  }

  get totals() {
    return this._totals.getValue();
  }

  constructor() {}

  ngOnInit() {}
}
