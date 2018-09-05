import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Food } from '../../../models/Food';

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

  @Input()
  set foods(foods) {
    this._foods.next(foods);
  }

  get foods() {
    return this._foods.getValue();
  }

  @Output()
  select = new EventEmitter();

  constructor(private modalService: NgbModal) {}

  ngOnInit() {}

  foodsByOthers() {
    this.includeFoodsAddedByOthers = !this.includeFoodsAddedByOthers;
    this.searchTerm = '';
  }

  searchFoods() {
    this.results = [];
    const st = this.searchTerm.toLowerCase();
    this.foods.forEach(f => {
      const fLc = f.name.toLowerCase();
      if (fLc === st) {
        this.results.push(f);
      }
      if (st === fLc.slice(0, st.length)) {
        this.results.push(f);
      }
    });
  }

  displayFoodInfo() {}

  selectFood(food, meal) {
    const selection = {
      food: food,
      meal: meal
    };

    this.select.emit(selection);
  }

  openModal(content, food) {
    this.selectedFood = food;
    this.modalService.open(content, { centered: true });
  }
}
