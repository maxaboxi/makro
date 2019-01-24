import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../models/User';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: User = {
    username: '',
    password: '',
    email: ''
  };

  passwordAgain = '';

  @ViewChild('registerForm')
  form: any;

  constructor(
    private flashMessage: FlashMessagesService,
    private auth: AuthService,
    private router: Router,
    private translator: TranslateService
  ) {}

  ngOnInit() {}

  submit({ value, valid }: { value: User; valid: boolean }) {
    if (this.passwordAgain !== this.user.password) {
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
      username: this.user.username,
      password: this.user.password,
      email: this.user.email
    };

    this.auth.register(data).subscribe(
      success => {
        this.flashMessage.show(this.translator.instant('REGISTER_SUCCESFULL'), {
          cssClass: 'alert-success',
          timeout: 2000
        });
        this.router.navigate(['/login']);
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
