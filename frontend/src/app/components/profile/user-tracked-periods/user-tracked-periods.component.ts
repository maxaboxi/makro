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
  trackedPeriodsDeleted = false;
  deletedTrackedPeriods: string[] = [];
  editing = false;

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

  getLastSevenDays() {
    this.loadingTrackedPeriod = true;
    let found = false;
    for (let i = 0; i < this.fetchedTrackedPeriods.length; i++) {
      if (this.fetchedTrackedPeriods[i].name === 'Last 7 days') {
        found = true;
        this.selectedTrackedPeriod = this.fetchedTrackedPeriods[i];
        this.loadingTrackedPeriod = false;
        break;
      }
    }

    if (!found) {
      this.trackedPeriodService.getLastSevenDays().subscribe(
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
                this.newTrackedPeriod = {
                  name: '',
                  dayIds: []
                };
                this.addedDays = [];
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
          this.addedDays = [];
        }
      },
      dismissed => {
        this.newTrackedPeriod = {
          name: '',
          dayIds: []
        };
        this.addedDays = [];
      }
    );
  }

  openEditTrackedPeriodModal(content) {
    this.addedDays = [];
    this.editing = true;
    const originalTrackedPeriod = { ...this.selectedTrackedPeriod };
    this.addedDays = JSON.parse(JSON.stringify(this.selectedTrackedPeriod.days));
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          const tp: NewTrackedPeriod = {
            name: this.selectedTrackedPeriod.name,
            uuid: this.selectedTrackedPeriod.uuid,
            dayIds: []
          };

          this.addedDays.forEach(d => {
            tp.dayIds.push(d.uuid);
          });

          this.trackedPeriodService.saveEditedTrackedPeriod(tp).subscribe(
            res => {
              if (res['success']) {
                this.selectedTrackedPeriod = undefined;
                this.getAllTrackedPeriods();

                for (let i = 0; i < this.fetchedTrackedPeriods.length; i++) {
                  if (this.fetchedTrackedPeriods[i].uuid === originalTrackedPeriod.uuid) {
                    this.fetchedTrackedPeriods.splice(i, 1);
                    break;
                  }
                }
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
          this.addedDays = [];
          this.editing = false;
          this.selectedTrackedPeriod = originalTrackedPeriod;
        }
      },
      dismissed => {
        this.addedDays = [];
        this.editing = false;
        this.selectedTrackedPeriod = originalTrackedPeriod;
      }
    );
  }

  openTrackedPeriod(trackedPeriod: TrackedPeriod) {
    this.loadingTrackedPeriod = true;
    let found = false;
    for (let i = 0; i < this.fetchedTrackedPeriods.length; i++) {
      if (this.fetchedTrackedPeriods[i].uuid === trackedPeriod.uuid) {
        found = true;
        this.selectedTrackedPeriod = this.fetchedTrackedPeriods[i];
        this.loadingTrackedPeriod = false;
        break;
      }
    }

    if (!found) {
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

  deleteTrackedPeriod(index: number) {
    this.deletedTrackedPeriods.push(this.trackedPeriods[index].uuid);
    this.trackedPeriods.splice(index, 1);
    this.trackedPeriodsDeleted = true;
  }

  deleteTrackedPeriodsFromDb() {
    this.trackedPeriodService.removeTrackedPeriods(this.deletedTrackedPeriods).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.trackedPeriodService.getAllTrackedPeriods().subscribe(tps => {
            this.trackedPeriods = tps;
          });
          this.trackedPeriodsDeleted = false;
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

  selectDay(index: number) {
    if (index > -1) {
      this.addedDays.push(this.days[index]);
      this.editing ? this.selectedTrackedPeriod.days.push(this.days[index]) : this.newTrackedPeriod.dayIds.push(this.days[index].uuid);
    }
  }

  removeDayFromAddedDays(index) {
    this.editing ? this.selectedTrackedPeriod.days.splice(index, 1) : this.newTrackedPeriod.dayIds.splice(index, 1);
    this.addedDays.splice(index, 1);
  }
}
