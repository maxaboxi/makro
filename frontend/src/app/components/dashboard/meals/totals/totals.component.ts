import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AddedFoodsService } from '../../../../services/added-foods.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from 'src/app/models/User';
import { Totals } from 'src/app/models/Totals';
import { DayService } from 'src/app/services/day.service';

@Component({
  selector: 'app-totals',
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.css']
})
export class TotalsComponent implements OnInit, OnDestroy {
  totals: Totals;
  _user = new BehaviorSubject<User>(null);
  loadedDayName: string;

  private subscriptions = new Subscription();

  @Input()
  set user(user) {
    this._user.next(user);
  }

  get user() {
    return this._user.getValue();
  }

  constructor(private addedFoodsService: AddedFoodsService, private modalService: NgbModal, private dayService: DayService) {}

  ngOnInit() {
    this.subscriptions.add(
      this.addedFoodsService._totals.subscribe(totals => {
        this.totals = totals;
      })
    );
    this.subscriptions.add(this.dayService.loadedDayName.subscribe(name => (this.loadedDayName = name)));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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
          localStorage.removeItem('previousMeals');
          this.dayService.loadedDayName.next(null);
        }
      },
      dismissed => {}
    );
  }
}
