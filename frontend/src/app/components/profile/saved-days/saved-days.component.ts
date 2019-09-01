import { Component, OnInit, Input, OnDestroy } from '@angular/core';
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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-saved-days',
  templateUrl: './saved-days.component.html',
  styleUrls: ['./saved-days.component.css']
})
export class SavedDaysComponent implements OnInit, OnDestroy {
  user: User;
  savedDays: Day[] = [];
  deletedDays: string[] = [];
  daysDeleted = false;
  loading = true;
  versionHistoryVisible = false;
  mealsLoaded = false;
  dayVersionHistory: Day[] = [];
  fetchedDays: Day[] = [];
  selectedDay: Day;
  latestVersionOfDay: Day = undefined;

  private subscriptions = new Subscription();

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
    this.subscriptions.add(
      this.auth.user.subscribe(user => {
        this.user = user;
        if (user.username) {
          this.getAllSavedDays();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private getAllSavedDays() {
    this.loading = true;
    this.subscriptions.add(
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
      )
    );
  }

  public loadDay(index: number) {
    this.setPreviousMeals();
    this.subscriptions.add(
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
      )
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

  public deleteDay(index: number) {
    this.deletedDays.push(this.savedDays[index].uuid);
    this.savedDays.splice(index, 1);
    this.daysDeleted = true;
  }

  public deleteDaysFromDb() {
    this.subscriptions.add(
      this.dayService.removeDays(this.deletedDays).subscribe(
        res => {
          if (res['success']) {
            this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
              cssClass: 'alert-success',
              timeout: 2000
            });
            this.subscriptions.add(
              this.dayService.getAllSavedDays().subscribe(days => {
                this.savedDays = days;
              })
            );
            this.daysDeleted = false;
          }
        },
        (error: Error) => {
          this.flashMessage.show(error['error'].msg, {
            cssClass: 'alert-danger',
            timeout: 2000
          });
        }
      )
    );
  }

  public openDayModal(content) {
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
          this.subscriptions.add(
            this.dayService.updateDayNames(changedDays).subscribe(
              res => {
                if (res['success']) {
                  this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
                    cssClass: 'alert-success',
                    timeout: 2000
                  });
                  this.subscriptions.add(
                    this.dayService.getAllSavedDays().subscribe(days => {
                      this.savedDays = days;
                    })
                  );
                }
              },
              (error: Error) => {
                this.flashMessage.show(error['error'].msg, {
                  cssClass: 'alert-danger',
                  timeout: 2000
                });
              }
            )
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

  public fetchDayVersions(day: Day) {
    this.latestVersionOfDay = day;
    this.subscriptions.add(
      this.dayService.getDayVersionHistory(day.uuid).subscribe(
        res => {
          this.dayVersionHistory = res;
          this.versionHistoryVisible = true;
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

  public fetchFoods(id: string) {
    this.selectedDay = undefined;
    this.mealsLoaded = false;
    let found = false;
    this.fetchedDays.forEach(d => {
      if (d.uuid == id) {
        found = true;
        this.selectedDay = d;
        this.mealsLoaded = true;
      }
    });

    if (!found) {
      this.subscriptions.add(
        this.dayService.getSavedDay(id).subscribe(
          day => {
            this.fetchedDays.push(day);
            this.selectedDay = day;
            this.mealsLoaded = true;
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
  }

  public restoreDay() {
    this.subscriptions.add(
      this.dayService.restoreDay(this.selectedDay.uuid).subscribe(
        res => {
          if (res['success']) {
            this.flashMessage.show(this.translator.instant('DAY_RESTORED_SUCCESFULLY'), {
              cssClass: 'alert-success',
              timeout: 2000
            });
            this.getAllSavedDays();
            this.selectedDay = undefined;
            this.mealsLoaded = false;
            this.versionHistoryVisible = false;
            this.latestVersionOfDay = undefined;
          } else {
            this.flashMessage.show(this.translator.instant('UNABLE_TO_RESTORE_DAY'), {
              cssClass: 'alert-danger',
              timeout: 2000
            });
          }
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

  public calculateDayTotals() {
    return this.addedFoodsService.calculateTotals(this.selectedDay.allMeals);
  }

  public backToSavedDays() {
    this.dayVersionHistory = [];
    this.mealsLoaded = false;
    this.versionHistoryVisible = false;
    this.selectedDay = undefined;
    this.latestVersionOfDay = undefined;
  }

  public openDeleteConfirmationModal(content, deleteAllVersions: boolean) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          if (deleteAllVersions) {
            this.subscriptions.add(
              this.dayService.removeDayAndVersions(this.latestVersionOfDay.uuid).subscribe(
                res => {
                  this.flashMessage.show(this.translator.instant('DAYS_DELETED_SUCCESFULLY'), {
                    cssClass: 'alert-success',
                    timeout: 2000
                  });
                  this.getAllSavedDays();
                  this.backToSavedDays();
                },
                (error: Error) => {
                  this.flashMessage.show(this.translator.instant('NETWORK_LOADING_ERROR'), {
                    cssClass: 'alert-danger',
                    timeout: 2000
                  });
                }
              )
            );
          } else {
            this.subscriptions.add(
              this.dayService.removeSingleDay(this.selectedDay.uuid).subscribe(
                res => {
                  this.flashMessage.show(this.translator.instant('DAY_DELETED_SUCCESFULLY'), {
                    cssClass: 'alert-success',
                    timeout: 2000
                  });
                  this.getAllSavedDays();
                  this.backToSavedDays();
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
        }
      },
      dismissed => {}
    );
  }
}
