import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Day } from '../models/Day';
import { Meal } from '../models/Meal';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DayService {
  private baseUrl = `${environment.baseUrl}/api/v1`;

  constructor(private http: HttpClient) {}

  getAllSavedDays(user) {
    const url = `${this.baseUrl}/days/getalldays/${user}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Day[]>(url, { headers: headers });
  }

  saveNewDay(day: Day) {
    const url = `${this.baseUrl}/days/addnewday`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, day, { headers: headers });
  }

  saveEditedDay(day) {
    const url = `${this.baseUrl}/days/saveday`;

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

  saveDayForSharing(meals) {
    const url = `${this.baseUrl}/shareddays/shareday`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, meals, { headers: headers });
  }

  getSharedDay(id) {
    const url = `${this.baseUrl}/shareddays/getsharedday/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Meal[]>(url, { headers: headers });
  }

  getSharedDaysByUser(id) {
    const url = `${this.baseUrl}/shareddays/getdayssharedbyuser/${id}`;

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
