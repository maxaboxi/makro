import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Meal } from '../models/Meal';
import { environment } from '../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.auth}/auth`;
  isLoggedIn = new BehaviorSubject(false);
  isAdmin = new BehaviorSubject(false);
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router, private translator: TranslateService) {}

  login(user: User) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/login`;

    return this.http.post(url, user, { headers: headers });
  }

  register(user: User) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/register`;

    return this.http.post(url, user, { headers: headers });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('meals');
    localStorage.removeItem('loadedDay');
    localStorage.setItem('makro_lang', 'fi');
    this.translator.use('fi');
    this.setDefaultUserInfo();
    this.isLoggedIn.next(false);
    this.isAdmin.next(false);
  }

  setUserInfo(user: User) {
    let differentNames = false;
    const mealsFromLocalStorage: Meal[] = JSON.parse(localStorage.getItem('meals'));
    if (!mealsFromLocalStorage || mealsFromLocalStorage.length !== user.meals.length) {
      localStorage.setItem('meals', JSON.stringify(user.meals));
    } else if (mealsFromLocalStorage) {
      mealsFromLocalStorage.forEach((m, i) => {
        if (m.name !== user.meals[i].name) {
          differentNames = true;
        }
      });
      if (differentNames) {
        localStorage.setItem('meals', JSON.stringify(user.meals));
      }
    }
    localStorage.setItem('makro_lang', user.lang);
    this.user.next(user);
  }

  setDefaultUserInfo() {
    this.user.next({
      username: '',
      age: 0,
      height: 0,
      weight: 0,
      activity: 0,
      sex: null,
      dailyExpenditure: 2000,
      userAddedExpenditure: 0,
      userAddedProteinTarget: 0,
      userAddedCarbTarget: 0,
      userAddedFatTarget: 0
    });
    this.setMeals();
  }

  setMeals() {
    const meals = [
      { name: 'Aamupala', foods: [] },
      { name: 'Lounas', foods: [] },
      { name: 'Välipala 1', foods: [] },
      { name: 'Sali', foods: [] },
      { name: 'Välipala 2', foods: [] },
      { name: 'Iltapala', foods: [] }
    ];
    if (!localStorage.getItem('meals')) {
      localStorage.setItem('meals', JSON.stringify(meals));
    }
  }

  fetchUserInfo() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/getuserinfo`;

    return this.http.get(url, { headers: headers });
  }

  getUserInfo() {
    if (!this.user.getValue()) {
      this.setDefaultUserInfo();
      if (localStorage.getItem('token')) {
        this.validateToken().subscribe(res => {
          if (res['success']) {
            this.fetchUserInfo().subscribe(result => {
              if (result['success']) {
                this.user.next(result['user']);
                this.isLoggedIn.next(true);
              }
            });
          } else {
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
          }
        });
      }
    }
    return this.user.getValue();
  }

  updateUserInfo(user: User) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/updateuserinformation`;

    return this.http.post(url, user, { headers: headers });
  }

  updateShowTargets(showTargets: boolean) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.user.getValue().showTargets = showTargets;

    const url = `${this.baseUrl}/updateshowtargets`;

    this.http.post(url, { showTargets: showTargets }, { headers: headers }).subscribe();
  }

  updateLanguage(lang: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.user.getValue().lang = lang;

    const url = `${this.baseUrl}/updatelanguage`;

    this.http.post(url, { lang: lang }, { headers: headers }).subscribe(res => {
      if (res['success']) {
        localStorage.setItem('makro_lang', lang);
      }
    });
  }

  changePassword(user) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/updatepassword`;

    return this.http.post(url, user, { headers: headers });
  }

  resetPassword(username) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/resetpassword`;
    const user = {
      username: username
    };

    return this.http.post(url, user, { headers: headers });
  }

  checkAdmin() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/checkadmin`;

    this.http.post<boolean>(url, { headers: headers }).subscribe(success => this.isAdmin.next(success), (error: Error) => {});
  }

  validateToken() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/validatetoken`;

    return this.http.post(url, { headers: headers });
  }

  getToken(): string {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      return token;
    }
    return null;
  }

  deleteAccount() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/deleteaccount`;

    return this.http.delete(url, { headers: headers });
  }

  getUsersCount() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/getamountofusers`;

    return this.http.get(url, { headers: headers });
  }
}
