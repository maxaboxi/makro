import { Component, OnInit, ViewChild } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { AddedFoodsService } from '../../services/added-foods.service';

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

  @ViewChild('loginForm')
  form: any;

  constructor(
    private flashMessage: FlashMessagesService,
    private auth: AuthService,
    private addedFoods: AddedFoodsService,
    private router: Router
  ) {}

  ngOnInit() {}

  submit({ value, valid }: { value: User; valid: boolean }) {
    if (!valid) {
      this.flashMessage.show(
        'Sekä käyttäjätunnus että salasana on vaadittuja tietoja.',
        {
          cssClass: 'alert-danger',
          timeout: 2500
        }
      );
      return;
    }

    const data = {
      username: this.user.username,
      password: this.user.password
    };

    this.auth.login(data).subscribe(
      success => {
        this.flashMessage.show('Olet nyt kirjautunut sisään', {
          cssClass: 'alert-success',
          timeout: 2000
        });
        // localStorage.removeItem('meals');
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
      }
    );
  }
}
