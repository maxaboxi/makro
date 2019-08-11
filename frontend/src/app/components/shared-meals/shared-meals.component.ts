import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedMealsService } from '../../services/shared-meals.service';
import { Meal } from '../../models/Meal';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shared-meals',
  templateUrl: './shared-meals.component.html',
  styleUrls: ['./shared-meals.component.css']
})
export class SharedMealsComponent implements OnInit, OnDestroy {
  allMeals: Meal[];
  sharedMealsFirst: Meal[];
  sharedMealsSecond: Meal[];
  user: User;
  searchTerm = '';
  results = [];
  loading = true;

  private subscriptions = new Subscription();

  constructor(
    private auth: AuthService,
    private sharedMealService: SharedMealsService,
    private flashMessage: FlashMessagesService,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.subscriptions.add(this.auth.user.subscribe(user => (this.user = user)));
    this.getAllMeals();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private getAllMeals() {
    this.subscriptions.add(
      this.sharedMealService.getAllMeals().subscribe(
        meals => {
          this.allMeals = JSON.parse(JSON.stringify(meals));
          if (meals.length % 2 === 0) {
            this.sharedMealsFirst = meals.splice(0, Math.floor(meals.length / 2));
          } else {
            this.sharedMealsFirst = meals.splice(0, Math.floor(meals.length / 2) + 1);
          }
          this.sharedMealsSecond = meals;
          this.loading = false;
        },
        (error: Error) => {
          this.loading = false;
          this.flashMessage.show(this.translator.instant('NETWORK_LOADING_ERROR'), {
            cssClass: 'alert-danger',
            timeout: 2000
          });
        }
      )
    );
  }

  searchMeals() {
    this.results = [];
    const secondaryResults = [];
    const tertiaryResults = [];
    const quaternaryResults = [];
    const searchTerm = this.searchTerm.toLowerCase();
    this.allMeals.forEach(m => {
      const mealNameLowercase = m.name.toLowerCase();
      const mealInfoLowercase = m.info.toLowerCase();
      const userLc = m.addedByName.toLowerCase();
      if (mealNameLowercase === searchTerm) {
        this.results.push(m);
      } else if (searchTerm === mealNameLowercase.slice(0, searchTerm.length)) {
        this.results.push(m);
      } else {
        const containsWhitespaces = mealNameLowercase.indexOf(' ') > 1;
        const containsBrackets = mealNameLowercase.indexOf('(') > 1;
        let added = false;
        if (containsWhitespaces && !containsBrackets) {
          for (let i = 0; i < mealNameLowercase.length; i++) {
            if (
              searchTerm.length > 1 &&
              mealNameLowercase[i] === ' ' &&
              mealNameLowercase.slice(i + 1, i + 1 + searchTerm.length) === searchTerm
            ) {
              secondaryResults.push(m);
              added = true;
            }

            if (
              searchTerm.length > 1 &&
              mealInfoLowercase[i] === ' ' &&
              mealInfoLowercase.slice(i + 1, i + 1 + searchTerm.length) === searchTerm
            ) {
              secondaryResults.push(m);
              added = true;
            }
          }
        }

        if (containsWhitespaces && containsBrackets) {
          for (let i = 0; i < mealNameLowercase.length; i++) {
            if (
              searchTerm.length > 1 &&
              mealNameLowercase[i] === '(' &&
              mealNameLowercase.slice(i + 1, i + 1 + searchTerm.length) === searchTerm
            ) {
              secondaryResults.push(m);
              added = true;
            }

            if (
              searchTerm.length > 1 &&
              mealInfoLowercase[i] === '(' &&
              mealInfoLowercase.slice(i + 1, i + 1 + searchTerm.length) === searchTerm
            ) {
              secondaryResults.push(m);
              added = true;
            }
          }
        }

        if (!added && searchTerm.length > 1) {
          for (let tag of m.tags) {
            const tagLc = tag.toLowerCase();
            if (tagLc === searchTerm) {
              tertiaryResults.push(m);
              added = true;
              break;
            }
          }
        }

        if ((!added && mealNameLowercase.indexOf(searchTerm) !== -1) || (!added && mealInfoLowercase.indexOf(searchTerm) !== -1)) {
          quaternaryResults.push(m);
          added = true;
        }

        if (!added && userLc.indexOf(searchTerm) !== -1) {
          quaternaryResults.push(m);
          added = true;
        }
      }
    });

    if (secondaryResults.length > 0) {
      this.results = this.results.concat(secondaryResults);
    }

    if (tertiaryResults.length > 0) {
      this.results = this.results.concat(tertiaryResults);
    }

    if (quaternaryResults.length > 0) {
      this.results = this.results.concat(quaternaryResults);
    }
  }
}
