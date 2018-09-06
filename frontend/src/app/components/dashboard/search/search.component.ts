import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Food } from '../../../models/Food';
import { AuthService } from '../../../services/auth.service';
import { AddedFoodsService } from '../../../services/added-foods.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  includeFoodsAddedByOthers = false;
  searchTerm = '';
  private _foods = new BehaviorSubject([]);
  results = [];
  selectedFood: Food;
  selectedMeal = '';
  selectedAmount: Number;
  meals = [];

  @Input()
  set foods(foods) {
    this._foods.next(foods);
  }

  get foods() {
    return this._foods.getValue();
  }

  constructor(
    private modalService: NgbModal,
    private auth: AuthService,
    private addedFoodsService: AddedFoodsService
  ) {}

  ngOnInit() {
    this.meals = [];
    const user = this.auth.getUserInfo();
    user.meals.forEach(meal => {
      this.meals.push(meal.name);
    });
    this.selectedMeal = this.meals[0];
  }

  foodsByOthers() {
    this.includeFoodsAddedByOthers = !this.includeFoodsAddedByOthers;
    this.searchTerm = '';
  }

  searchFoods() {
    this.results = [];
    const secondaryResults = [];
    const st = this.searchTerm.toLowerCase();
    this.foods.forEach(f => {
      const fLc = f.name.toLowerCase();
      if (fLc === st) {
        this.results.push(f);
      } else if (st === fLc.slice(0, st.length)) {
        this.results.push(f);
      } else {
        const containsWhitespaces = fLc.indexOf(' ') > 1;
        if (containsWhitespaces) {
          for (let i = 0; i < fLc.length; i++) {
            if (
              st.length > 1 &&
              fLc[i] === ' ' &&
              fLc.slice(i + 1, i + 1 + st.length) === st
            ) {
              secondaryResults.push(f);
            }
          }
        }
      }
    });

    if (secondaryResults.length > 0) {
      this.results = this.results.concat(secondaryResults);
    }
  }

  selectFood(food) {
    const selection = {
      food: food,
      amount: this.selectedAmount ? this.selectedAmount : 100,
      meal: this.selectedMeal
    };

    this.addedFoodsService.addFoodToMeals(selection);
  }

  openModal(content, food) {
    this.selectedFood = food;
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.selectFood(food);
        } else {
          this.selectedFood = null;
        }
      },
      dismissed => {
        this.selectedFood = null;
      }
    );
  }
}
