import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Day } from '../models/Day';
import { Feedback } from '../models/Feedback';
import { User } from '../models/User';
import { environment } from '../../environments/environment';
import { Like } from '../models/Like';
import { Food } from '../models/Food';
import { TrackedPeriod } from '../models/TrackedPeriod';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = `${environment.baseUrl}/admin`;

  constructor(private http: HttpClient) {}

  getMostRecentUsers() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/user`;

    return this.http.get<User[]>(url, { headers: headers });
  }

  getAllUsers() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/user/all`;

    return this.http.get<User[]>(url, { headers: headers });
  }

  getUser(userId: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/user/${userId}`;

    return this.http.get<User>(url, { headers: headers });
  }

  removeUsers(users: String[]) {
    const url = `${this.baseUrl}/user/delete/multiple`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      body: users
    };

    return this.http.delete(url, options);
  }

  updateUserInformation(user: User) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/updateuserinformation`;

    return this.http.post(url, user, { headers: headers });
  }

  updateUserPassword(user) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/updateuserpassword`;

    return this.http.post(url, user, { headers: headers });
  }

  getMostRecentDays() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/day`;

    return this.http.get<Day[]>(url, { headers: headers });
  }

  getAllDays() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/day/all`;

    return this.http.get<Day[]>(url, { headers: headers });
  }

  getDay(dayId) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/day/${dayId}`;

    return this.http.get<Day>(url, { headers: headers });
  }

  getAllSharedDays() {
    const url = `${this.baseUrl}/day/shared`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get(url, { headers: headers });
  }

  removeDays(days) {
    const url = `${this.baseUrl}/day/delete/multiple`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      body: days
    };

    return this.http.delete(url, options);
  }

  removeSharedDays(days) {
    const url = `${this.baseUrl}/day/shared/delete/multiple`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      body: days
    };

    return this.http.delete(url, options);
  }

  removeFeedbacks(feedbacks: String[]) {
    const url = `${this.baseUrl}/feedback/delete/multiple`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      body: feedbacks
    };

    return this.http.delete(url, options);
  }

  submitAnswer(feedback: Feedback) {
    const url = `${this.baseUrl}/feedback/answer`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, feedback, { headers: headers });
  }

  getMostRecentFoods() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/food`;

    return this.http.get<Food[]>(url, { headers: headers });
  }

  getAllFoods() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/food/all`;

    return this.http.get<Food[]>(url, { headers: headers });
  }

  getAllLikes() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/like`;

    return this.http.get<Like[]>(url, { headers: headers });
  }

  getAllTrackedPeriods() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/trackedperiod`;

    return this.http.get<TrackedPeriod[]>(url, { headers: headers });
  }

  getTrackedPeriod(id: string) {
    const url = `${this.baseUrl}/trackedPeriod/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<TrackedPeriod>(url, { headers: headers });
  }

  removeTrackedPeriods(tpIds: string[]) {
    const url = `${this.baseUrl}/trackedperiod/delete/multiple`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      body: tpIds
    };

    return this.http.delete(url, options);
  }
}
