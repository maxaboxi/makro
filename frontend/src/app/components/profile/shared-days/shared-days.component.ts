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
      if (user._id) {
        this.dayService.getSharedDaysByUser(this.user._id).subscribe(days => {
          this.sharedDays = JSON.parse(JSON.stringify(days));
        });
      }
    });
  }

  deleteDay(index) {
    this.deletedDays.push(this.sharedDays[index]._id);
    this.sharedDays.splice(index, 1);
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
            this.sharedDays = JSON.parse(JSON.stringify(days));
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
