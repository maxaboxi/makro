import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Day } from '../models/Day';
import { Meal } from '../models/Meal';
import { environment } from '../../environments/environment';
import { DayName } from '../models/DayName';

@Injectable({
  providedIn: 'root'
})
export class DayService {
  private baseUrl = `${environment.baseUrl}/day`;

  constructor(private http: HttpClient) {}

  getAllSavedDays() {
    const url = `${this.baseUrl}/user`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Day[]>(url, { headers: headers });
  }

  getSavedDay(id: string) {
    const url = `${this.baseUrl}/single/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Day>(url, { headers: headers });
  }

  getMultipleSavedDays(ids: string[]) {
    const url = `${this.baseUrl}/multiple/`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<Day[]>(url, ids, { headers: headers });
  }

  saveNewDay(day: Day) {
    const url = `${this.baseUrl}/new`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, day, { headers: headers });
  }

  saveEditedDay(day: Day) {
    const url = `${this.baseUrl}/update/${day.uuid}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put(url, day, { headers: headers });
  }

  removeDays(days) {
    const url = `${this.baseUrl}/delete/multiple`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      body: days
    };

    return this.http.delete(url, options);
  }

  updateDayNames(days: DayName[]) {
    const url = `${this.baseUrl}/updatenames`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put(url, days, { headers: headers });
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
    const url = `${this.baseUrl}/shared/delete/multiple`;

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
