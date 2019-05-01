import { Component, OnInit } from '@angular/core';
import { TrackedPeriodService } from 'src/app/services/tracked-period.service';
import { TrackedPeriod } from 'src/app/models/TrackedPeriod';
import { ConnectionService } from 'src/app/services/connection.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NewTrackedPeriod } from 'src/app/models/NewTrackedPeriod';
import { Day } from 'src/app/models/Day';
import { DayService } from 'src/app/services/day.service';

@Component({
  selector: 'app-user-tracked-periods',
  templateUrl: './user-tracked-periods.component.html',
  styleUrls: ['./user-tracked-periods.component.css']
})
export class UserTrackedPeriodsComponent implements OnInit {
  trackedPeriods: TrackedPeriod[] = [];
  loading = true;
  loadingTrackedPeriod = false;
  online;
  addedDays: Day[] = [];
  days: Day[];
  newTrackedPeriod: NewTrackedPeriod = {
    name: '',
    dayIds: []
  };
  selectedTrackedPeriod: TrackedPeriod;
  fetchedTrackedPeriods: TrackedPeriod[] = [];

  constructor(
    private trackedPeriodService: TrackedPeriodService,
    private connectionService: ConnectionService,
    private modalService: NgbModal,
    private translator: TranslateService,
    private flashMessage: FlashMessagesService,
    private dayService: DayService
  ) {}

  ngOnInit() {
    this.connectionService.monitor().subscribe(res => (this.online = res));
    this.getAllTrackedPeriods();
    this.dayService.getAllSavedDays().subscribe(res => (this.days = res));
  }

  getAllTrackedPeriods() {
    this.loading = true;
    this.trackedPeriodService.getAllTrackedPeriods().subscribe(
      res => {
        this.trackedPeriods = res;
        this.loading = false;
      },
      (error: Error) => {
        console.error(error);
        this.loading = false;
      }
    );
  }

  openModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.trackedPeriodService.saveNewTrackedPeriod(this.newTrackedPeriod).subscribe(
            res => {
              if (res['success']) {
                this.flashMessage.show(this.translator.instant('TRACKED_PERIOD_SAVED'), {
                  cssClass: 'alert-success',
                  timeout: 2000
                });
                this.getAllTrackedPeriods();
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
          this.newTrackedPeriod = {
            name: '',
            dayIds: []
          };
        }
      },
      dismissed => {
        this.newTrackedPeriod = {
          name: '',
          dayIds: []
        };
      }
    );
  }

  openTrackedPeriod(trackedPeriod: TrackedPeriod) {
    this.checkIfAlreadyFetched(trackedPeriod);
  }

  checkIfAlreadyFetched(trackedPeriod: TrackedPeriod) {
    this.loadingTrackedPeriod = true;
    let tp: TrackedPeriod;
    for (let i = 0; i < this.fetchedTrackedPeriods.length; i++) {
      if (this.fetchedTrackedPeriods[i].uuid === trackedPeriod.uuid) {
        tp = this.fetchedTrackedPeriods[i];
        this.loadingTrackedPeriod = false;
      }
    }

    if (!tp) {
      this.trackedPeriodService.getTrackedPeriod(trackedPeriod.uuid).subscribe(
        res => {
          this.selectedTrackedPeriod = res;
          this.fetchedTrackedPeriods.push(res);
          this.loadingTrackedPeriod = false;
        },
        (error: Error) => {
          this.flashMessage.show(error['error'].msg, {
            cssClass: 'alert-danger',
            timeout: 2000
          });
          this.loadingTrackedPeriod = false;
        }
      );
    }
  }

  selectDay(index: number) {
    if (index > -1) {
      this.addedDays.push(this.days[index]);
      this.newTrackedPeriod.dayIds.push(this.days[index].uuid);
    }
  }
}
