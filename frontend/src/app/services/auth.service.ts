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
  private baseUrl = `${environment.baseUrl}/user`;
  private baseUrlMeal = `${environment.baseUrl}/meal`;
  isLoggedIn = new BehaviorSubject(false);
  isAdmin = new BehaviorSubject(false);
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router, private translator: TranslateService) {}

  login(user) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/authenticate`;
    console.log(url);

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
      uuid: '',
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
    const url = `${this.baseUrl}/`;

    return this.http.get<User>(url, { headers: headers });
  }

  getUserInfo() {
    if (!this.user.getValue()) {
      this.setDefaultUserInfo();
      if (localStorage.getItem('token')) {
        this.fetchUserInfo().subscribe(
          user => {
            this.user.next(user);
            this.isLoggedIn.next(true);
          },
          (error: Error) => {
            this.isLoggedIn.next(false);
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
          }
        );
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

    const url = `${this.baseUrl}/targets`;

    this.http.post(url, { show: showTargets }, { headers: headers }).subscribe();
  }

  updateLanguage(lang: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.user.getValue().lang = lang;

    const url = `${this.baseUrl}/language/${lang}`;

    this.http.post(url, { headers: headers }).subscribe(res => {
      if (res['success']) {
        localStorage.setItem('makro_lang', lang);
      }
    });
  }

  updateMealNames(mealNames: Meal[]) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrlMeal}/user/meals`;

    return this.http.post<Meal[]>(url, mealNames, { headers: headers });
  }

  changePassword(user) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/changepassword`;

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
    const url = `${this.baseUrl}/admin`;

    this.http.get<boolean>(url, { headers: headers }).subscribe(res => this.isAdmin.next(res['success']), (error: Error) => {});
  }

  getToken(): string {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      return token;
    }
    return null;
  }

  deleteAccount(user) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/delete`;

    return this.http.post(url, user, { headers: headers });
  }

  getUsersCount() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/amount`;

    return this.http.get(url, { headers: headers });
  }
}
