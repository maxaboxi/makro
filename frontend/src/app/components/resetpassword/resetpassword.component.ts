import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  user = {
    email: '',
    password: '',
    passwordResetToken: ''
  };
  passwordAgain = '';

  constructor(
    private flashMessage: FlashMessagesService,
    private auth: AuthService,
    private router: Router,
    private translator: TranslateService
  ) {}

  ngOnInit() {}

  submit() {
    if (!this.user.email || !this.user.password || !this.user.passwordResetToken) {
      this.flashMessage.show(this.translator.instant('FILL_REQUIRED_FIELDS'), {
        cssClass: 'alert-danger',
        timeout: 2500
      });
      return;
    }

    if (this.passwordAgain !== this.user.password) {
      this.flashMessage.show(this.translator.instant('PASSWORDS_DONT_MATCH'), {
        cssClass: 'alert-danger',
        timeout: 2500
      });
      return;
    }

    this.auth.resetPassword(this.user).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(this.translator.instant('PASSWORD_RESET_SUCCESFULL'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.router.navigate(['/login']);
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
