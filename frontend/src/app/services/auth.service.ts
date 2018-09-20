import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Meal } from '../models/Meal';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://api.makro.diet/auth';
  isLoggedIn = new BehaviorSubject(false);
  isAdmin = new BehaviorSubject(false);
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router) {}

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
    this.setDefaultUserInfo();
    this.isLoggedIn.next(false);
    this.isAdmin.next(false);
  }

  setUserInfo(user: User) {
    let differentNames = false;
    const mealsFromLocalStorage: Meal[] = JSON.parse(
      localStorage.getItem('meals')
    );
    if (
      !mealsFromLocalStorage ||
      mealsFromLocalStorage.length !== user.meals.length
    ) {
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

    this.http.post<boolean>(url, { headers: headers }).subscribe(
      success => this.isAdmin.next(success),
      (error: Error) => {
        console.log(error);
      }
    );
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
}
