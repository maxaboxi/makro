import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Day } from '../models/Day';
import { Meal } from '../models/Meal';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DayService {
  private baseUrl = `${environment.baseUrl}/day`;

  constructor(private http: HttpClient) { }

  getAllSavedDays() {
    const url = `${this.baseUrl}/user`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Day[]>(url, { headers: headers });
  }

  getSavedDay(id) {
    const url = `${this.baseUrl}/single/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Day>(url, { headers: headers });
  }

  saveNewDay(day: Day) {
    const url = `${this.baseUrl}/new`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, day, { headers: headers });
  }

  saveEditedDay(day) {
    const url = `${this.baseUrl}/update`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, day, { headers: headers });
  }

  removeDays(days) {
    const url = `${this.baseUrl}/days/removedays`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      body: days
    };

    return this.http.delete(url, options);
  }

  updateDayNames(days) {
    const url = `${this.baseUrl}/days/updatedaynames`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, days, { headers: headers });
  }

  shareDay(day: Day) {
    const url = `${this.baseUrl}/share`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, day, { headers: headers });
  }

  getSharedDay(id) {
    const url = `${this.baseUrl}/shared/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Meal[]>(url, { headers: headers });
  }

  getSharedDaysByUser() {
    const url = `${this.baseUrl}/shared/user`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get(url, { headers: headers });
  }

  removeSharedDays(days) {
    const url = `${this.baseUrl}/shareddays/removeshareddays`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      body: days
    };

    return this.http.delete(url, options);
  }
}
