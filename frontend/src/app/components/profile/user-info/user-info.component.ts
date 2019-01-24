import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../../models/User';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  user: User;
  showInfo = false;
  changed = false;
  showDeleteAccount = false;
  newUserPassword;
  newUserPasswordAgain;
  loading = true;

  constructor(
    private auth: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private modalService: NgbModal,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.auth.fetchUserInfo().subscribe(res => {
      this.user = JSON.parse(JSON.stringify(res['user']));
      this.calculateBaseExpenditure();
    });
  }

  calculateBaseExpenditure() {
    if (this.user.height !== 0 && this.user.weight !== 0 && this.user.age !== 0 && this.user.sex !== null && this.user.activity >= 1) {
      if (this.user.sex == 'mies') {
        this.user.dailyExpenditure = 88.4 + 13.4 * this.user.weight + 4.8 * this.user.height - 5.7 * this.user.age;
      } else {
        this.user.dailyExpenditure = 447.6 + 9.25 * this.user.weight + 3.1 * this.user.height - 4.3 * this.user.age;
      }
      this.user.dailyExpenditure *= this.user.activity;
    }
    this.loading = false;
  }

  toggleInfo() {
    this.showInfo = !this.showInfo;
  }

  addNewMeal() {
    this.user.meals.push({
      name: this.translator.instant('MEAL') + ' ' + (this.user.meals.length + 1),
      foods: []
    });
    this.changed = true;
  }

  deleteMeal(index) {
    this.user.meals.splice(index, 1);
    this.changed = true;
  }

  updateInfo() {
    this.user.meals.forEach((m, i) => {
      if (m.name.length === 0) {
        m.name = this.translator.instant('MEAL') + ' ' + (i + 1);
      }
    });
    const userInfo: User = {
      username: this.user.username,
      email: this.user.email,
      age: this.user.age,
      height: this.user.height,
      weight: this.user.weight,
      activity: this.user.activity,
      sex: this.user.sex,
      dailyExpenditure: this.user.dailyExpenditure,
      userAddedExpenditure: this.user.userAddedExpenditure,
      userAddedProteinTarget: this.user.userAddedProteinTarget,
      userAddedCarbTarget: this.user.userAddedCarbTarget,
      userAddedFatTarget: this.user.userAddedFatTarget,
      meals: this.user.meals,
      showTargets: this.user.showTargets
    };
    this.auth.updateUserInfo(userInfo).subscribe(
      res => {
        if (res) {
          this.changed = false;
          this.auth.setUserInfo(res['user']);
          this.user = this.auth.getUserInfo();
          this.calculateBaseExpenditure();
          this.flashMessage.show('Tiedot päivitetty', {
            cssClass: 'alert-success',
            timeout: 2000
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
  }

  openModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.updateInfo();
        } else {
          this.user = this.auth.getUserInfo();
          this.changed = false;
        }
      },
      dismissed => {
        this.user = this.auth.getUserInfo();
        this.changed = false;
      }
    );
  }

  openChangePasswordModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          if (this.newUserPassword !== this.newUserPasswordAgain) {
            this.flashMessage.show(this.translator.instant('CHANGE_PASSWORDS_DONT_MATCH'), {
              cssClass: 'alert-danger',
              timeout: 2000
            });
          } else {
            const user = {
              _id: this.user._id,
              password: this.newUserPassword
            };
            this.auth.changePassword(user).subscribe(
              res => {
                if (res['success']) {
                  this.flashMessage.show(this.translator.instant('PASSWORD_CHANGED'), {
                    cssClass: 'alert-success',
                    timeout: 2000
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
          }
        }
        this.newUserPassword = null;
        this.newUserPasswordAgain = null;
      },
      dismissed => {
        this.newUserPassword = null;
        this.newUserPasswordAgain = null;
      }
    );
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.auth.isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  toggleDelete() {
    this.showDeleteAccount = !this.showDeleteAccount;
  }

  deleteAccount() {
    if (confirm(this.translator.instant('DELETE_ACCOUNT_CONFIRMATION'))) {
      this.auth.deleteAccount().subscribe(
        success => {
          this.flashMessage.show(this.translator.instant('ACCOUNT_DELETED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.logout();
        },
        (error: Error) => {
          this.flashMessage.show(error['error'].msg, {
            cssClass: 'alert-danger',
            timeout: 2000
          });
        }
      );
    } else {
      this.showDeleteAccount = false;
    }
  }
}
