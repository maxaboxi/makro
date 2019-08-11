import { Component, OnInit, OnDestroy } from '@angular/core';
import { AddedFoodsService } from '../../../../services/added-foods.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-targets',
  templateUrl: './targets.component.html',
  styleUrls: ['./targets.component.css']
})
export class TargetsComponent implements OnInit, OnDestroy {
  targets;
  totals;
  showTargets: boolean;

  private subscriptions = new Subscription();

  constructor(private addedFoodsService: AddedFoodsService) {}

  ngOnInit() {
    this.subscriptions.add(
      this.addedFoodsService._targets.subscribe(targets => {
        this.targets = targets;
      })
    );
    this.subscriptions.add(
      this.addedFoodsService._totals.subscribe(totals => {
        this.totals = totals;
      })
    );
    this.subscriptions.add(this.addedFoodsService._showTargets.subscribe(show => (this.showTargets = show)));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
