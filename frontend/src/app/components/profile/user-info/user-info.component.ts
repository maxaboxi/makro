import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../../models/User';
import { TranslateService } from '@ngx-translate/core';
import { ConnectionService } from '../../../services/connection.service';

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
  currentPassword;
  loading = true;
  online;

  constructor(
    private auth: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private modalService: NgbModal,
    private translator: TranslateService,
    private connectionService: ConnectionService
  ) {}

  ngOnInit() {
    this.connectionService.monitor().subscribe(res => (this.online = res));
    this.auth.fetchUserInfo().subscribe(
      user => {
        this.user = user;
        this.calculateBaseExpenditure();
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
    const userInfo: User = {
      username: this.user.username,
      email: this.user.email,
      age: this.user.age,
      height: this.user.height,
      weight: this.user.weight,
      activity: this.user.activity,
      sex: this.user.sex
    };
    this.auth.updateUserInfo(userInfo).subscribe(
      res => {
        if (res) {
          this.changed = false;
          this.auth.setUserInfo(res['value']);
          this.user = this.auth.getUserInfo();
          this.calculateBaseExpenditure();
          this.flashMessage.show(this.translator.instant('INFORMATION_UPDATED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
        }
      },
      (error: Error) => {
        this.flashMessage.show(this.translator.instant('NETWORK_LOADING_ERROR'), {
          cssClass: 'alert-danger',
          timeout: 2000
        });
      }
    );
  }

  updateMealNames() {
    this.user.meals.forEach((m, i) => {
      if (m.name.length === 0) {
        m.name = this.translator.instant('MEAL') + ' ' + (i + 1);
      }
    });

    this.auth.updateMealNames(this.user.meals).subscribe(
      res => {
        if (res.length > 0) {
          this.flashMessage.show(this.translator.instant('INFORMATION_UPDATED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.user.meals = res;
          this.auth.setUserInfo(this.user);
          this.changed = false;
        } else {
          this.flashMessage.show(res['message'], {
            cssClass: 'alert-danger',
            timeout: 2000
          });
        }
      },
      (error: Error) => {
        this.flashMessage.show('Something went wrong', {
          cssClass: 'alert-danger',
          timeout: 2000
        });
      }
    );
  }

  openModal(content, editingMealNames: boolean) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          if (!editingMealNames) {
            this.updateInfo();
          } else {
            this.updateMealNames();
          }
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
              usernameOrEmail: this.user.username,
              password: this.currentPassword,
              newPassword: this.newUserPassword
            };
            this.auth.changePassword(user).subscribe(
              res => {
                if (res['success']) {
                  this.flashMessage.show(this.translator.instant('PASSWORD_CHANGED'), {
                    cssClass: 'alert-success',
                    timeout: 2000
                  });
                  this.newUserPassword = null;
                  this.newUserPasswordAgain = null;
                  this.currentPassword = null;
                } else {
                  this.flashMessage.show(this.translator.instant('WRONG_CREDENTIALS'), {
                    cssClass: 'alert-danger',
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
      },
      dismissed => {
        this.newUserPassword = null;
        this.newUserPasswordAgain = null;
        this.currentPassword = null;
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

  deleteAccount(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          const user = {
            usernameOrEmail: this.user.username,
            password: this.currentPassword
          };
          this.auth.deleteAccount(user).subscribe(
            res => {
              if (res['success']) {
                this.flashMessage.show(this.translator.instant('ACCOUNT_DELETED'), {
                  cssClass: 'alert-success',
                  timeout: 2000
                });
                this.logout();
              } else {
                this.flashMessage.show(this.translator.instant('WRONG_CREDENTIALS'), {
                  cssClass: 'alert-danger',
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
      },
      dismissed => {}
    );
    this.showDeleteAccount = false;
    this.currentPassword = null;
  }
}
