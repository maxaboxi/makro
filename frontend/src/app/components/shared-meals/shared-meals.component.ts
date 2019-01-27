import { Component, OnInit } from '@angular/core';
import { SharedMealsService } from '../../services/shared-meals.service';
import { Meal } from '../../models/Meal';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-shared-meals',
  templateUrl: './shared-meals.component.html',
  styleUrls: ['./shared-meals.component.css']
})
export class SharedMealsComponent implements OnInit {
  allMeals: Meal[];
  sharedMealsFirst: Meal[];
  sharedMealsSecond: Meal[];
  user: User;
  searchTerm = '';
  results = [];
  loading = true;

  constructor(
    private auth: AuthService,
    private sharedMealService: SharedMealsService,
    private flashMessage: FlashMessagesService,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => (this.user = user));
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
    );
  }

  searchMeals() {
    this.results = [];
    const secondaryResults = [];
    const tertiaryResults = [];
    const quaternaryResults = [];
    const st = this.searchTerm.toLowerCase();
    this.allMeals.forEach(m => {
      const mLc = m.name.toLowerCase();
      const mdLc = m.info.toLowerCase();
      const userLc = m.username.toLowerCase();
      if (mLc === st) {
        this.results.push(m);
      } else if (st === mLc.slice(0, st.length)) {
        this.results.push(m);
      } else {
        const containsWhitespaces = mLc.indexOf(' ') > 1;
        const containsBrackets = mLc.indexOf('(') > 1;
        let added = false;
        if (containsWhitespaces && !containsBrackets) {
          for (let i = 0; i < mLc.length; i++) {
            if (st.length > 1 && mLc[i] === ' ' && mLc.slice(i + 1, i + 1 + st.length) === st) {
              secondaryResults.push(m);
              added = true;
            }

            if (st.length > 1 && mdLc[i] === ' ' && mdLc.slice(i + 1, i + 1 + st.length) === st) {
              secondaryResults.push(m);
              added = true;
            }
          }
        }
        if (containsWhitespaces && containsBrackets) {
          for (let i = 0; i < mLc.length; i++) {
            if (st.length > 1 && mLc[i] === '(' && mLc.slice(i + 1, i + 1 + st.length) === st) {
              secondaryResults.push(m);
              added = true;
            }

            if (st.length > 1 && mdLc[i] === '(' && mdLc.slice(i + 1, i + 1 + st.length) === st) {
              secondaryResults.push(m);
              added = true;
            }
          }
        }

        if (!added && st.length > 1) {
          for (let tag of m.tags) {
            const tagLc = tag.toLowerCase();
            if (tagLc === st) {
              tertiaryResults.push(m);
              added = true;
              break;
            }
          }
        }

        if ((!added && mLc.indexOf(st) !== -1) || (!added && mdLc.indexOf(st) !== -1)) {
          quaternaryResults.push(m);
          added = true;
        }

        if (!added && userLc.indexOf(st) !== -1) {
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
