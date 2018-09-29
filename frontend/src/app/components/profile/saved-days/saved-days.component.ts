import { Component, OnInit, Input } from '@angular/core';
import { Day } from '../../../models/Day';
import { DayService } from '../../../services/day.service';
import { User } from '../../../models/User';
import { BehaviorSubject } from 'rxjs';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddedFoodsService } from '../../../services/added-foods.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-saved-days',
  templateUrl: './saved-days.component.html',
  styleUrls: ['./saved-days.component.css']
})
export class SavedDaysComponent implements OnInit {
  user: User;
  savedDays: Day[] = [];
  savedDaysFirst: Day[] = [];
  savedDaysSecond: Day[] = [];
  daysSplit = false;
  deletedDays = [];
  daysDeleted = false;

  constructor(
    private auth: AuthService,
    private dayService: DayService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private modalService: NgbModal,
    private addedFoodsService: AddedFoodsService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user = user;
      if (user.username) {
        this.dayService.getAllSavedDays(this.user.username).subscribe(days => {
          this.sortSavedDays(days);
        });
      }
    });
  }

  sortSavedDays(days) {
    if (days.length <= 10) {
      this.daysSplit = false;
      this.savedDays = days;
    } else {
      this.daysSplit = true;
      if (days.length % 2 === 0) {
        this.savedDaysFirst = days.splice(0, Math.floor(days.length / 2));
      } else {
        this.savedDaysFirst = days.splice(0, Math.floor(days.length / 2) + 1);
      }
      this.savedDaysSecond = days;
    }
  }

  loadDay(index, array) {
    if (array === 'savedDays') {
      localStorage.setItem(
        'meals',
        JSON.stringify(this.savedDays[index].meals)
      );
      localStorage.setItem(
        'loadedDay',
        JSON.stringify(this.savedDays[index]._id)
      );
    }

    if (array === 'savedDaysFirst') {
      localStorage.setItem(
        'meals',
        JSON.stringify(this.savedDaysFirst[index].meals)
      );
      localStorage.setItem(
        'loadedDay',
        JSON.stringify(this.savedDaysFirst[index]._id)
      );
    }

    if (array === 'savedDaysSecond') {
      localStorage.setItem(
        'meals',
        JSON.stringify(this.savedDaysSecond[index].meals)
      );
      localStorage.setItem(
        'loadedDay',
        JSON.stringify(this.savedDaysSecond[index]._id)
      );
    }
    this.addedFoodsService._mealsEdited.next(false);
    this.addedFoodsService._openedSavedMeal.next(true);
    this.addedFoodsService.setMealsFromLocalStorage();
    this.router.navigate(['/']);
  }

  deleteDay(index, array) {
    if (array === 'savedDays') {
      this.deletedDays.push(this.savedDays[index]._id);
      this.savedDays.splice(index, 1);
    }

    if (array === 'savedDaysFirst') {
      this.deletedDays.push(this.savedDaysFirst[index]._id);
      this.savedDaysFirst.splice(index, 1);
    }

    if (array === 'savedDaysSecond') {
      this.deletedDays.push(this.savedDaysSecond[index]._id);
      this.savedDaysSecond.splice(index, 1);
    }

    this.daysDeleted = true;
  }

  deleteDaysFromDb() {
    this.dayService.removeDays(this.deletedDays).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show('Muutokset tallennettu.', {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.dayService
            .getAllSavedDays(this.user.username)
            .subscribe(days => {
              this.sortSavedDays(days);
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
    const changedDays = [];
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.savedDays.forEach((d, i) => {
            if (d.name !== originalDays[i].name) {
              changedDays.push(d);
            }
          });
          this.dayService.updateDayNames(changedDays).subscribe(
            res => {
              if (res['success']) {
                this.flashMessage.show('Muutokset tallennettu', {
                  cssClass: 'alert-success',
                  timeout: 2000
                });
                this.dayService
                  .getAllSavedDays(this.user.username)
                  .subscribe(days => {
                    this.sortSavedDays(days);
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
