import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../models/User';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) {}

  ngOnInit() {}

  submit({ value, valid }: { value: User; valid: boolean }) {
    if (this.passwordAgain !== this.user.password) {
      this.flashMessage.show('Salasanat eivät täsmää.', {
        cssClass: 'alert-danger',
        timeout: 2500
      });
      return;
    }

    if (!valid) {
      this.flashMessage.show('Täytä kaikki vaaditut kentät', {
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
        this.flashMessage.show('Rekisteröityminen onnistui', {
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
