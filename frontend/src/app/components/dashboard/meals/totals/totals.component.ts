import { Component, OnInit, Input } from '@angular/core';
import { AddedFoodsService } from '../../../../services/added-foods.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-totals',
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.css']
})
export class TotalsComponent implements OnInit {
  totals;
  _user = new BehaviorSubject<User>(null);

  @Input()
  set user(user) {
    this._user.next(user);
  }

  get user() {
    return this._user.getValue();
  }

  constructor(private addedFoodsService: AddedFoodsService, private modalService: NgbModal) {}

  ngOnInit() {
    this.addedFoodsService._totals.subscribe(totals => {
      this.totals = totals;
    });
  }

  clearSelectedFoods() {
    if (this.user && this.user.meals) {
      this.addedFoodsService.resetMeals(this.user.meals);
    } else {
      this.addedFoodsService.resetMeals(JSON.parse(localStorage.getItem('meals')));
    }
  }

  openModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.clearSelectedFoods();
          this.addedFoodsService._openedSavedMeal.next(false);
          this.addedFoodsService._mealsEdited.next(false);
          localStorage.removeItem('loadedDay');
        }
      },
      dismissed => {}
    );
  }
}
