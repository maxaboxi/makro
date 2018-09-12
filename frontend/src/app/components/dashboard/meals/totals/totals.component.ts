import { Component, OnInit } from '@angular/core';
import { AddedFoodsService } from '../../../../services/added-foods.service';

@Component({
  selector: 'app-totals',
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.css']
})
export class TotalsComponent implements OnInit {
  private totals;

  constructor(private addedFoodsService: AddedFoodsService) {}

  ngOnInit() {
    this.addedFoodsService._totals.subscribe(totals => {
      this.totals = totals;
    });
  }

  clearSelectedFoods() {
    this.addedFoodsService.resetMeals();
  }
}
