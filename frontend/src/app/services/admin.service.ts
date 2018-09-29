import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Day } from '../models/Day';
import { Feedback } from '../models/Feedback';
import { User } from '../models/User';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = `${environment.baseUrl}/admin`;

  constructor(private http: HttpClient) {}

  removeUsers(users) {
    const url = `${this.baseUrl}/removeusers`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      body: users
    };

    return this.http.delete(url, options);
  }

  updateUserInformation(user) {
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

  getAllDays() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/getalldays`;

    return this.http.get<Day[]>(url, { headers: headers });
  }

  getAllSharedDays() {
    const url = `${this.baseUrl}/getallshareddays`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get(url, { headers: headers });
  }

  removeFeedbacks(feedbacks) {
    const url = `${this.baseUrl}/removefeedbacks`;

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
    const url = `${this.baseUrl}/answertofeedback`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, feedback, { headers: headers });
  }

  getAllUsers() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/getallusers`;

    return this.http.get<User[]>(url, { headers: headers });
  }
}