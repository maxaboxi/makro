import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { DayService } from '../../../services/day.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from '../../../models/User';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shared-days',
  templateUrl: './shared-days.component.html',
  styleUrls: ['./shared-days.component.css']
})
export class SharedDaysComponent implements OnInit, OnDestroy {
  user: User;
  sharedDays = [];
  deletedDays = [];
  daysDeleted = false;
  loading = true;

  private subscriptions = new Subscription();

  constructor(
    private auth: AuthService,
    private dayService: DayService,
    private flashMessage: FlashMessagesService,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.auth.user.subscribe(user => {
        this.user = user;
        if (user.uuid) {
          this.subscriptions.add(
            this.dayService.getSharedDaysByUser().subscribe(
              days => {
                this.sharedDays = JSON.parse(JSON.stringify(days));
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
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  deleteDay(index: number) {
    this.deletedDays.push(this.sharedDays[index].uuid);
    this.sharedDays.splice(index, 1);
    this.daysDeleted = true;
  }

  deleteDaysFromDb() {
    this.subscriptions.add(
      this.dayService.removeSharedDays(this.deletedDays).subscribe(
        res => {
          if (res['success']) {
            this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
              cssClass: 'alert-success',
              timeout: 2000
            });
            this.subscriptions.add(
              this.dayService.getSharedDaysByUser().subscribe(days => {
                this.sharedDays = JSON.parse(JSON.stringify(days));
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
}
