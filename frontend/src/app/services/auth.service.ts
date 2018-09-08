import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:1337/auth';
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private user: User;

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
    this.isLoggedIn.next(false);
  }

  setUserInfo(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.user = user;
  }

  getUserInfo() {
    if (!this.user) {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
    return this.user;
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
