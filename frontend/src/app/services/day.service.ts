import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Day } from '../models/Day';

@Injectable({
  providedIn: 'root'
})
export class DayService {
  private baseUrl = 'http://localhost:1337/api/v1';

  constructor(private http: HttpClient) {}

  getAllSavedDays(user) {
    const url = `${this.baseUrl}/getalldays/${user}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Day[]>(url, { headers: headers });
  }

  saveNewDay(day: Day) {
    const url = `${this.baseUrl}/addnewday`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, day, { headers: headers });
  }

  saveEditedDay(day) {
    const url = `${this.baseUrl}/saveday`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, day, { headers: headers });
  }

  removeDays(days) {
    const url = `${this.baseUrl}/removedays`;

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
