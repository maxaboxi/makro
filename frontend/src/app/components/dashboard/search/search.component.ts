import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Food } from '../../../models/Food';
import { AuthService } from '../../../services/auth.service';
import { AddedFoodsService } from '../../../services/added-foods.service';
import { User } from '../../../models/User';

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
  selectedAmount: number;
  meals = [];
  isLoggedIn = false;
  defaultValues = [10, 30, 50, 100];
  amountClicked = 0;
  private _user = new BehaviorSubject<User>(null);

  @ViewChild('searchbar') search: ElementRef;

  ngAfterViewInit() {
    this.search.nativeElement.focus();
  }

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

  constructor(private modalService: NgbModal, private auth: AuthService, private addedFoodsService: AddedFoodsService) {}

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
    this.searchFoods();
  }

  searchFoods() {
    if (this.searchTerm.length >= 2) {
      let searchArray;
      if (!this.isLoggedIn) {
        searchArray = this.allFoods;
      } else if (this.isLoggedIn && this.includeFoodsAddedByOthers) {
        searchArray = this.allFoods;
      } else {
        searchArray = this.foods;
      }
      this.results = [];
      const secondaryResults = [];
      const tertiaryResults = [];
      const st = this.searchTerm.toLowerCase();
      searchArray.forEach(f => {
        const fLc = f.name.toLowerCase();
        if (fLc === st) {
          this.results.push(f);
        } else if (st === fLc.slice(0, st.length)) {
          this.results.push(f);
        } else {
          const containsWhitespaces = fLc.indexOf(' ') > 1;
          const containsBrackets = fLc.indexOf('(') > 1;
          let added = false;
          if (containsWhitespaces && !containsBrackets) {
            for (let i = 0; i < fLc.length; i++) {
              if (st.length > 1 && fLc[i] === ' ' && fLc.slice(i + 1, i + 1 + st.length) === st) {
                secondaryResults.push(f);
                added = true;
              }
            }
          }
          if (containsWhitespaces && containsBrackets) {
            for (let i = 0; i < fLc.length; i++) {
              if (st.length > 1 && fLc[i] === '(' && fLc.slice(i + 1, i + 1 + st.length) === st) {
                secondaryResults.push(f);
                added = true;
              }
            }
          }

          if (!added && fLc.indexOf(st) !== -1) {
            tertiaryResults.push(f);
          }
        }
      });

      if (secondaryResults.length > 0) {
        this.results = this.results.concat(secondaryResults);
      }

      if (tertiaryResults.length > 0) {
        this.results = this.results.concat(tertiaryResults);
      }
    } else {
      this.results = [];
    }
  }

  setAmount() {
    this.selectedAmount += this.amountClicked;
  }

  selectFood(food) {
    const selection = {
      food: food,
      amount: this.selectedAmount !== undefined ? this.selectedAmount : 100,
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
