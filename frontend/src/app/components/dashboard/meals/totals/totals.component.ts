import { Component, OnInit } from '@angular/core';
import { AddedFoodsService } from '../../../../services/added-foods.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-totals',
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.css']
})
export class TotalsComponent implements OnInit {
  private totals;

  constructor(
    private addedFoodsService: AddedFoodsService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.addedFoodsService._totals.subscribe(totals => {
      this.totals = totals;
    });
  }

  clearSelectedFoods() {
    this.addedFoodsService.resetMeals();
  }

  openModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.clearSelectedFoods();
          this.addedFoodsService._openedSavedMeal.next(false);
          this.addedFoodsService._mealsEdited.next(false);
        }
      },
      dismissed => {}
    );
  }
}
