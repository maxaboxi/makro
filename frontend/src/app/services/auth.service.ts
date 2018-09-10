import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:1337/auth';
  isLoggedIn = new BehaviorSubject(false);
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) {}

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
    localStorage.removeItem('user');
    this.setDefaultUserInfo();
    this.isLoggedIn.next(false);
  }

  setUserInfo(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
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
      userAddedFatTarget: 0,
      meals: [
        { name: 'Aamiainen', foods: [] },
        { name: 'Lounas', foods: [] },
        { name: 'Välipala 1', foods: [] },
        { name: 'Sali', foods: [] },
        { name: 'Illallinen', foods: [] },
        { name: 'Iltapala', foods: [] }
      ]
    });
  }

  getUserInfo() {
    if (!this.user.getValue()) {
      if (localStorage.getItem('user')) {
        this.user.next(JSON.parse(localStorage.getItem('user')));
      } else {
        this.setDefaultUserInfo();
      }
      if (localStorage.getItem('token') && !this.isLoggedIn.getValue()) {
        this.validateToken().subscribe(res => {
          if (res['success']) {
            this.isLoggedIn.next(true);
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
