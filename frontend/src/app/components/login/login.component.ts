import { Component, OnInit, ViewChild } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { AddedFoodsService } from '../../services/added-foods.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User = {
    username: '',
    password: ''
  };
  username;
  showPasswordReset = false;

  @ViewChild('loginForm')
  form: any;

  constructor(
    private flashMessage: FlashMessagesService,
    private auth: AuthService,
    private addedFoods: AddedFoodsService,
    private router: Router,
    private translator: TranslateService
  ) {}

  ngOnInit() {}

  submit({ value, valid }: { value: User; valid: boolean }) {
    if (!valid) {
      this.flashMessage.show(this.translator.instant('USERNAME_PASSWORD_REQUIRED'), {
        cssClass: 'alert-danger',
        timeout: 2500
      });
      return;
    }

    const data = {
      username: this.user.username,
      password: this.user.password
    };

    this.auth.login(data).subscribe(
      success => {
        this.flashMessage.show(this.translator.instant('LOGGED_IN'), {
          cssClass: 'alert-success',
          timeout: 2000
        });
        localStorage.removeItem('loadedDay');
        localStorage.setItem('token', success['token']);
        this.auth.setUserInfo(success['user']);
        this.addedFoods.setMealsFromLocalStorage();
        this.auth.isLoggedIn.next(true);
        this.router.navigate(['/']);
      },
      (error: Error) => {
        this.flashMessage.show(error['error'].msg, {
          cssClass: 'alert-danger',
          timeout: 2000
        });
        this.showPasswordReset = true;
      }
    );
  }

  resetPassword() {
    this.auth.resetPassword(this.user.username).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(res['msg'], {
            cssClass: 'alert-success',
            timeout: 3000
          });
          this.showPasswordReset = false;
        } else {
          this.flashMessage.show(res['msg'], {
            cssClass: 'alert-danger',
            timeout: 3000
          });
        }
        this.username = null;
      },
      (error: Error) => {
        this.flashMessage.show(error['error'].msg, {
          cssClass: 'alert-danger',
          timeout: 2000
        });
        this.showPasswordReset = true;
      }
    );
  }
}
