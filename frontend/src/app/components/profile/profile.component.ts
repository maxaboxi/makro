import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from '../../models/User';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;
  showInfo = false;

  @ViewChild('editUserInformationForm')
  form: any;

  constructor(
    private auth: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.user = this.auth.getUserInfo();
    this.calculateBaseExpenditure();
  }

  calculateBaseExpenditure() {
    if (
      this.user.height !== 0 &&
      this.user.weight !== 0 &&
      this.user.age !== 0 &&
      this.user.sex !== null &&
      this.user.activity >= 1
    ) {
      if (this.user.sex == 'mies') {
        this.user.dailyExpenditure =
          88.4 +
          13.4 * this.user.weight +
          4.8 * this.user.height -
          5.7 * this.user.age;
      } else {
        this.user.dailyExpenditure =
          447.6 +
          9.25 * this.user.weight +
          3.1 * this.user.height -
          4.3 * this.user.age;
      }
      this.user.dailyExpenditure *= this.user.activity;
    }
  }

  toggleInfo() {
    this.showInfo = !this.showInfo;
  }

  openModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
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
            userAddedFatTarget: this.user.userAddedFatTarget
          };
          this.auth.updateUserInfo(userInfo).subscribe(
            res => {
              if (res) {
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
      },
      dismissed => {}
    );
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.auth.isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  deleteAccount() {
    if (
      confirm(
        'Oletko varma, että haluat poistaa käyttäjätilisi? Tilin mukana poistetaan myös kaikki tallentamasi tieto paitsi lisäämäsi ruoat. Tilin poistoa ei voi perua.'
      )
    ) {
      this.auth.deleteAccount().subscribe(
        success => {
          this.flashMessage.show('Tili poistettu.', {
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
    }
  }
}
