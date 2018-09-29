import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { DayService } from '../../../services/day.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from '../../../models/User';

@Component({
  selector: 'app-shared-days',
  templateUrl: './shared-days.component.html',
  styleUrls: ['./shared-days.component.css']
})
export class SharedDaysComponent implements OnInit {
  user: User;
  sharedDays = [];
  sharedDaysFirst = [];
  sharedDaysSecond = [];
  daysSplit = false;
  deletedDays = [];
  daysDeleted = false;

  constructor(
    private auth: AuthService,
    private dayService: DayService,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user = user;
      if (user.username) {
        this.dayService.getSharedDaysByUser(this.user._id).subscribe(days => {
          this.sortsharedDays(days);
        });
      }
    });
  }

  sortsharedDays(days) {
    if (days.length <= 10) {
      this.daysSplit = false;
      this.sharedDays = days;
    } else {
      this.daysSplit = true;
      if (days.length % 2 === 0) {
        this.sharedDaysFirst = days.splice(0, Math.floor(days.length / 2));
      } else {
        this.sharedDaysFirst = days.splice(0, Math.floor(days.length / 2) + 1);
      }
      this.sharedDaysSecond = days;
    }
  }

  deleteDay(index, array) {
    if (array === 'sharedDays') {
      this.deletedDays.push(this.sharedDays[index]._id);
      this.sharedDays.splice(index, 1);
    }

    if (array === 'sharedDaysFirst') {
      this.deletedDays.push(this.sharedDaysFirst[index]._id);
      this.sharedDaysFirst.splice(index, 1);
    }

    if (array === 'sharedDaysSecond') {
      this.deletedDays.push(this.sharedDaysSecond[index]._id);
      this.sharedDaysSecond.splice(index, 1);
    }

    this.daysDeleted = true;
  }

  deleteDaysFromDb() {
    this.dayService.removeSharedDays(this.deletedDays).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show('Muutokset tallennettu.', {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.dayService.getSharedDaysByUser(this.user._id).subscribe(days => {
            this.sortsharedDays(days);
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
}
