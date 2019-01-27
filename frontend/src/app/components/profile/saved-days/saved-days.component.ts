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
import { TranslateService } from '@ngx-translate/core';

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
        this.dayService.getAllSavedDays(this.user.username).subscribe(
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

  loadDay(index) {
    localStorage.setItem('meals', JSON.stringify(this.savedDays[index].meals));
    localStorage.setItem('loadedDay', JSON.stringify(this.savedDays[index]._id));
    this.addedFoodsService._mealsEdited.next(false);
    this.addedFoodsService._openedSavedMeal.next(true);
    this.addedFoodsService.setMealsFromLocalStorage();
    this.router.navigate(['/']);
  }

  deleteDay(index) {
    this.deletedDays.push(this.savedDays[index]._id);
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
          this.dayService.getAllSavedDays(this.user.username).subscribe(days => {
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
                this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
                  cssClass: 'alert-success',
                  timeout: 2000
                });
                this.dayService.getAllSavedDays(this.user.username).subscribe(days => {
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
