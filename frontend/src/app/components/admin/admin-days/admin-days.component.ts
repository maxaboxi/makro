import { Component, OnInit } from '@angular/core';
import { DayService } from '../../../services/day.service';
import { Day } from '../../../models/Day';
import { AdminService } from '../../../services/admin.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-admin-days',
  templateUrl: './admin-days.component.html',
  styleUrls: ['./admin-days.component.css']
})
export class AdminDaysComponent implements OnInit {
  days: Day[];
  sharedDays;
  propertiesToShowDays = [{ name: 'username', date: false }, { name: 'name', date: false }];
  propertiesToShowSharedDays = [{ name: '_id', date: false, link: true }, { name: 'createdAt', date: true }];
  selectedDay: Day;
  deletedDays = [];
  daysDeleted = false;
  deletedSharedDays = [];
  sharedDaysDeleted = false;

  constructor(
    private dayService: DayService,
    private adminService: AdminService,
    private modalService: NgbModal,
    private flashMessage: FlashMessagesService,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.adminService.getAllSharedDays().subscribe(days => {
      this.sharedDays = JSON.parse(JSON.stringify(days));
    });
    this.adminService.getAllDays().subscribe(days => (this.days = days));
  }

  openDayModal(content, day) {
    this.selectedDay = day;
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        this.selectedDay = null;
      },
      dismissed => {
        this.selectedDay = null;
      }
    );
  }

  deleteDay(index) {
    this.deletedDays.push(this.days[index]._id);
    this.days.splice(index, 1);
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
          this.deletedDays = [];
          this.daysDeleted = false;
          this.adminService.getAllDays().subscribe(days => (this.days = days));
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

  deleteSharedDay(index) {
    this.deletedSharedDays.push(this.sharedDays[index]._id);
    this.sharedDays.splice(index, 1);
    this.sharedDaysDeleted = true;
  }

  deleteSharedDaysFromDb() {
    this.dayService.removeSharedDays(this.deletedSharedDays).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.adminService.getAllSharedDays().subscribe(days => {
            this.sharedDays = JSON.parse(JSON.stringify(days));
          });
          this.sharedDaysDeleted = false;
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
