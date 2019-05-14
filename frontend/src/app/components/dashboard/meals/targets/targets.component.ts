import { Component, OnInit } from '@angular/core';
import { AddedFoodsService } from '../../../../services/added-foods.service';

@Component({
  selector: 'app-targets',
  templateUrl: './targets.component.html',
  styleUrls: ['./targets.component.css']
})
export class TargetsComponent implements OnInit {
  targets;
  totals;
  caloriesLeft: Number;
  showTargets: boolean;

  constructor(private addedFoodsService: AddedFoodsService) {}

  ngOnInit() {
    this.addedFoodsService._targets.subscribe(targets => {
      this.targets = targets;
    });
    this.addedFoodsService._totals.subscribe(totals => {
      this.totals = totals;
    });
    this.addedFoodsService._showTargets.subscribe(show => (this.showTargets = show));
  }
}
