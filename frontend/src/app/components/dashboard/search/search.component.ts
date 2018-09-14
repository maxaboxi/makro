import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Food } from '../../../models/Food';
import { AuthService } from '../../../services/auth.service';
import { AddedFoodsService } from '../../../services/added-foods.service';
import { User } from '../../../models/User';
import { FoodService } from '../../../services/food.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  includeFoodsAddedByOthers = false;
  searchTerm = '';
  private _foods = new BehaviorSubject([]);
  private _allFoods = new BehaviorSubject([]);
  results = [];
  selectedFood: Food;
  selectedMeal = '';
  selectedAmount: Number;
  meals = [];
  isLoggedIn = false;
  private _user = new BehaviorSubject<User>(null);

  @Input()
  set foods(foods) {
    this._foods.next(foods);
  }

  get foods() {
    return this._foods.getValue();
  }

  @Input()
  set allFoods(foods) {
    this._allFoods.next(foods);
  }

  get allFoods() {
    return this._allFoods.getValue();
  }

  @Input()
  set user(user) {
    this._user.next(user);
  }

  get user() {
    return this._user.getValue();
  }

  @Output()
  changed = new EventEmitter<any>();

  constructor(
    private modalService: NgbModal,
    private auth: AuthService,
    private foodService: FoodService,
    private addedFoodsService: AddedFoodsService,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit() {
    this.auth.isLoggedIn.subscribe(res => {
      this.isLoggedIn = res;
      const meals = JSON.parse(localStorage.getItem('meals'));
      this.meals = [];
      meals.forEach(meal => {
        this.meals.push(meal.name);
        this.selectedMeal = this.meals[0];
      });
    });
  }

  foodsByOthers() {
    this.includeFoodsAddedByOthers = !this.includeFoodsAddedByOthers;
    this.searchTerm = '';
  }

  searchFoods() {
    if (!this.isLoggedIn) {
      this.includeFoodsAddedByOthers = true;
    }
    this.results = [];
    const secondaryResults = [];
    const st = this.searchTerm.toLowerCase();
    if (this.includeFoodsAddedByOthers) {
      this.allFoods.forEach(f => {
        const fLc = f.name.toLowerCase();
        if (fLc === st) {
          this.results.push(f);
        } else if (st === fLc.slice(0, st.length)) {
          this.results.push(f);
        } else {
          const containsWhitespaces = fLc.indexOf(' ') > 1;
          const containsBrackets = fLc.indexOf('(') > 1;
          if (containsWhitespaces && !containsBrackets) {
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
          if (containsWhitespaces && containsBrackets) {
            for (let i = 0; i < fLc.length; i++) {
              if (
                st.length > 1 &&
                fLc[i] === '(' &&
                fLc.slice(i + 1, i + 1 + st.length) === st
              ) {
                secondaryResults.push(f);
              }
            }
          }
        }
      });
    } else {
      this.foods.forEach(f => {
        const fLc = f.name.toLowerCase();
        if (fLc === st) {
          this.results.push(f);
        } else if (st === fLc.slice(0, st.length)) {
          this.results.push(f);
        } else {
          const containsWhitespaces = fLc.indexOf(' ') > 1;
          const containsBrackets = fLc.indexOf('(') > 1;
          if (containsWhitespaces && !containsBrackets) {
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
          if (containsWhitespaces && containsBrackets) {
            for (let i = 0; i < fLc.length; i++) {
              if (
                st.length > 1 &&
                fLc[i] === '(' &&
                fLc.slice(i + 1, i + 1 + st.length) === st
              ) {
                secondaryResults.push(f);
              }
            }
          }
        }
      });
    }

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
        }
        this.selectedFood = null;
      },
      dismissed => {
        this.selectedFood = null;
      }
    );
  }
}
