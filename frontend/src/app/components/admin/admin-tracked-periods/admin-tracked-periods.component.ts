import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrackedPeriod } from 'src/app/models/TrackedPeriod';
import { AdminService } from 'src/app/services/admin.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-tracked-periods',
  templateUrl: './admin-tracked-periods.component.html',
  styleUrls: ['./admin-tracked-periods.component.css']
})
export class AdminTrackedPeriodsComponent implements OnInit, OnDestroy {
  trackedPeriods: TrackedPeriod[];
  propertiesToShow = [{ name: 'username', date: false }, { name: 'name', date: false }];
  selectedTrackedPeriod: TrackedPeriod;
  trackedPeriodsDeleted = false;
  deletedTrackedPeriods: string[] = [];

  private subscriptions = new Subscription();

  constructor(private adminService: AdminService, private flashMessage: FlashMessagesService, private translator: TranslateService) {}

  ngOnInit() {
    this.subscriptions.add(this.adminService.getAllTrackedPeriods().subscribe(tps => (this.trackedPeriods = tps)));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  openTrackedPeriod(tp: TrackedPeriod) {
    this.subscriptions.add(this.adminService.getTrackedPeriod(tp.uuid).subscribe(tp => (this.selectedTrackedPeriod = tp)));
  }

  deleteTrackedPeriod(index: number) {
    this.deletedTrackedPeriods.push(this.trackedPeriods[index].uuid);
    this.trackedPeriods.splice(index, 1);
    this.trackedPeriodsDeleted = true;
  }

  deleteTrackedPeriodsFromDb() {
    this.subscriptions.add(
      this.adminService.removeTrackedPeriods(this.deletedTrackedPeriods).subscribe(
        res => {
          if (res['success']) {
            this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
              cssClass: 'alert-success',
              timeout: 2000
            });
            this.subscriptions.add(
              this.adminService.getAllTrackedPeriods().subscribe(tps => {
                this.trackedPeriods = tps;
              })
            );
            this.trackedPeriodsDeleted = false;
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
