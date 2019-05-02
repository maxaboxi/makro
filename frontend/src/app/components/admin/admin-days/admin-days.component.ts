import { Component, OnInit } from '@angular/core';
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
  selectedDayTotals = {
    energy: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0
  };

  constructor(
    private adminService: AdminService,
    private modalService: NgbModal,
    private flashMessage: FlashMessagesService,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.adminService.getAllSharedDays().subscribe(days => {
      this.sharedDays = JSON.parse(JSON.stringify(days));
    });
    this.adminService.getMostRecentDays().subscribe(days => (this.days = days));
  }

  getAllDays() {
    this.adminService.getAllDays().subscribe(days => (this.days = days));
  }

  openDayModal(content, day) {
    this.adminService.getDay(day.uuid).subscribe(
      res => {
        this.selectedDay = res;
        this.selectedDay.allMeals.forEach(m => {
          m.foods.forEach(f => {
            this.selectedDayTotals.energy += f.energy;
            (this.selectedDayTotals.protein += f.protein),
              (this.selectedDayTotals.carbs += f.carbs),
              (this.selectedDayTotals.fat += f.fat),
              (this.selectedDayTotals.fiber += f.fiber),
              (this.selectedDayTotals.sugar += f.sugar);
          });
        });
        this.modalService.open(content, { centered: true }).result.then(
          result => {
            this.selectedDay = null;
            this.selectedDayTotals = {
              energy: 0,
              protein: 0,
              carbs: 0,
              fat: 0,
              fiber: 0,
              sugar: 0
            };
          },
          dismissed => {
            this.selectedDay = null;
            this.selectedDayTotals = {
              energy: 0,
              protein: 0,
              carbs: 0,
              fat: 0,
              fiber: 0,
              sugar: 0
            };
          }
        );
      },
      (error: Error) => {
        this.flashMessage.show(this.translator.instant('NETWORK_LOADING_ERROR'), {
          cssClass: 'alert-danger',
          timeout: 2000
        });
      }
    );
  }

  deleteDay(index) {
    this.deletedDays.push(this.days[index].uuid);
    this.days.splice(index, 1);
    this.daysDeleted = true;
  }

  deleteDaysFromDb() {
    this.adminService.removeDays(this.deletedDays).subscribe(
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
    this.deletedSharedDays.push(this.sharedDays[index].uuid);
    this.sharedDays.splice(index, 1);
    this.sharedDaysDeleted = true;
  }

  deleteSharedDaysFromDb() {
    this.adminService.removeSharedDays(this.deletedSharedDays).subscribe(
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
