import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from 'src/app/services/auth.service';
import { AddedFoodsService } from 'src/app/services/added-foods.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css'],
  animations: [
    trigger('signInAnimation', [
      state(
        'initial',
        style({
          transform: 'translateX(0)'
        })
      ),
      state(
        'final',
        style({
          transform: 'translateX(100%)'
        })
      ),
      transition('initial=>final', animate('600ms'))
    ]),
    trigger('signUpAnimation', [
      state(
        'initial',
        style({
          transform: 'translateX(0)',
          opacity: '0'
        })
      ),
      state(
        'final',
        style({
          transform: 'translateX(100%)',
          opacity: '1',
          zIndex: '5'
        })
      ),
      transition('initial=>final', animate('600ms'))
    ]),
    trigger('overlayContainerAnimation', [
      state(
        'initial',
        style({
          transform: 'translateX(0)'
        })
      ),
      state(
        'final',
        style({
          transform: 'translateX(-100%)'
        })
      )
    ]),
    trigger('overlaySignInAnimation', [
      state('initial', style({})),
      state(
        'final',
        style({
          transform: 'translateX(100%)'
        })
      )
    ]),
    trigger('overlaySignUpAnimation', [
      state('initial', style({})),
      state(
        'final',
        style({
          transform: 'translateX(100%)'
        })
      )
    ])
  ]
})
export class LoginRegisterComponent implements OnInit {
  loginUser: User = {
    username: '',
    password: ''
  };
  registerUser: User = {
    username: '',
    password: '',
    email: ''
  };
  username: string;
  showPasswordReset = false;
  registerActive = false;
  currentState = 'initial';
  passwordAgain = '';

  constructor(
    private flashMessage: FlashMessagesService,
    private auth: AuthService,
    private addedFoods: AddedFoodsService,
    private router: Router,
    private translator: TranslateService
  ) {}

  ngOnInit() {}

  changeState() {
    this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
    this.registerActive = !this.registerActive;
  }

  submitLoginForm({ value, valid }: { value: User; valid: boolean }) {
    if (!valid) {
      this.flashMessage.show(this.translator.instant('USERNAME_PASSWORD_REQUIRED'), {
        cssClass: 'alert-danger',
        timeout: 2500
      });
      return;
    }

    const data = {
      usernameOrEmail: this.loginUser.username,
      password: this.loginUser.password
    };

    this.auth.login(data).subscribe(
      success => {
        this.flashMessage.show(this.translator.instant('LOGGED_IN'), {
          cssClass: 'alert-success',
          timeout: 2000
        });
        console.log(success);
        localStorage.removeItem('loadedDay');
        localStorage.setItem('token', success['token']);
        this.auth.setUserInfo(success['user']);
        this.translator.use(success['user'].lang);
        this.addedFoods.setMealsFromLocalStorage();
        this.auth.isLoggedIn.next(true);
        this.router.navigate(['/']);
      },
      (error: Error) => {
        this.flashMessage.show(this.translator.instant('WRONG_CREDENTIALS'), {
          cssClass: 'alert-danger',
          timeout: 2000
        });
        this.showPasswordReset = true;
      }
    );
  }

  forgotPassword() {
    this.auth.forgotPassword(this.loginUser.username).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(res['message'], {
            cssClass: 'alert-success',
            timeout: 3000
          });
          this.showPasswordReset = false;
          this.router.navigate(['/resetpassword']);
        } else {
          this.flashMessage.show(res['message'], {
            cssClass: 'alert-danger',
            timeout: 3000
          });
        }
        this.username = null;
      },
      (error: Error) => {
        this.flashMessage.show('Something went wrong', {
          cssClass: 'alert-danger',
          timeout: 2000
        });
        this.showPasswordReset = true;
      }
    );
  }

  submitRegisterForm({ value, valid }: { value: User; valid: boolean }) {
    if (this.passwordAgain !== this.registerUser.password) {
      this.flashMessage.show(this.translator.instant('PASSWORDS_DONT_MATCH'), {
        cssClass: 'alert-danger',
        timeout: 2500
      });
      return;
    }

    if (!valid) {
      this.flashMessage.show(this.translator.instant('FILL_REQUIRED_FIELDS'), {
        cssClass: 'alert-danger',
        timeout: 2500
      });
      return;
    }

    const data = {
      username: this.registerUser.username,
      password: this.registerUser.password,
      email: this.registerUser.email ? this.registerUser.email : null
    };

    this.auth.register(data).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(this.translator.instant('REGISTER_SUCCESFULL'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.changeState();
          this.registerUser = {
            username: '',
            password: '',
            email: ''
          };
        } else {
          this.flashMessage.show(res['message'], {
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
