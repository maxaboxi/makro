import { Component, OnInit, Input } from '@angular/core';
import { Day } from '../../../models/Day';
import { DayService } from '../../../services/day.service';
import { User } from '../../../models/User';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddedFoodsService } from '../../../services/added-foods.service';
import { AuthService } from '../../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { DayName } from 'src/app/models/DayName';
import { Meal } from 'src/app/models/Meal';

@Component({
  selector: 'app-saved-days',
  templateUrl: './saved-days.component.html',
  styleUrls: ['./saved-days.component.css']
})
export class SavedDaysComponent implements OnInit {
  user: User;
  savedDays: Day[] = [];
  deletedDays = [];
  daysDeleted = false;
  loading = true;

  constructor(
    private auth: AuthService,
    private dayService: DayService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private modalService: NgbModal,
    private addedFoodsService: AddedFoodsService,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user = user;
      if (user.username) {
        this.dayService.getAllSavedDays().subscribe(
          days => {
            this.savedDays = days;
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
    });
  }

  loadDay(index: number) {
    this.setPreviousMeals();
    this.dayService.getSavedDay(this.savedDays[index].uuid).subscribe(
      day => {
        const userMeals: Meal[] = JSON.parse(JSON.stringify(this.user.meals));
        userMeals.forEach(m => {
          let found = false;
          for (let i = 0; i < day.allMeals.length; i++) {
            if (day.allMeals[i].name === m.name) {
              found = true;
              break;
            }
          }

          if (!found) {
            day.allMeals.push(m);
          }
        });

        localStorage.setItem('meals', JSON.stringify(day.allMeals));
        localStorage.setItem('loadedDay', JSON.stringify({ id: this.savedDays[index].uuid, name: day.name }));
        this.dayService.loadedDayName.next(day.name);
        this.addedFoodsService._mealsEdited.next(false);
        this.addedFoodsService._openedSavedMeal.next(true);
        this.addedFoodsService.setMealsFromLocalStorage();
        this.router.navigate(['/']);
      },
      (error: Error) => {
        this.flashMessage.show(this.translator.instant('NETWORK_LOADING_ERROR'), {
          cssClass: 'alert-danger',
          timeout: 2000
        });
      }
    );
  }

  private setPreviousMeals() {
    const loadedDay = JSON.parse(localStorage.getItem('loadedDay'));
    const meals: Meal[] = JSON.parse(localStorage.getItem('meals'));
    let foodsAdded = 0;
    meals.forEach(m => {
      foodsAdded += m.foods.length;
    });
    if (foodsAdded > 0) {
      let day = {
        id: '',
        name: '',
        meals: meals
      };

      if (loadedDay !== null) {
        day.id = loadedDay.id;
        day.name = loadedDay.name;
      }

      localStorage.setItem('previousMeals', JSON.stringify(day));
      this.addedFoodsService._previousMealsSavedToLocalStorage.next(true);
    }
  }

  deleteDay(index: number) {
    this.deletedDays.push(this.savedDays[index].uuid);
    this.savedDays.splice(index, 1);
    this.daysDeleted = true;
  }

  deleteDaysFromDb() {
    this.dayService.removeDays(this.deletedDays).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.dayService.getAllSavedDays().subscribe(days => {
            this.savedDays = days;
          });
          this.daysDeleted = false;
        }
      },
      (error: Error) => {
        this.flashMessage.show(error['error'].msg, {
          cssClass: 'alert-danger',
          timeout: 2000
        });
      }
    );
  }

  openDayModal(content) {
    const originalDays = JSON.parse(JSON.stringify(this.savedDays));
    const changedDays: DayName[] = [];
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.savedDays.forEach((d, i) => {
            if (d.name !== originalDays[i].name) {
              changedDays.push({ uuid: d.uuid, name: d.name });
            }
          });
          this.dayService.updateDayNames(changedDays).subscribe(
            res => {
              if (res['success']) {
                this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
                  cssClass: 'alert-success',
                  timeout: 2000
                });
                this.dayService.getAllSavedDays().subscribe(days => {
                  this.savedDays = days;
                });
              }
            },
            (error: Error) => {
              this.flashMessage.show(error['error'].msg, {
                cssClass: 'alert-danger',
                timeout: 2000
              });
            }
          );
        } else {
          this.savedDays = JSON.parse(JSON.stringify(originalDays));
        }
      },
      dismissed => {
        this.savedDays = JSON.parse(JSON.stringify(originalDays));
      }
    );
  }
}
