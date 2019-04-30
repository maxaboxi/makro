import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TrackedPeriod } from '../models/TrackedPeriod';
import { NewTrackedPeriod } from '../models/NewTrackedPeriod';

@Injectable({
  providedIn: 'root'
})
export class TrackedPeriodService {
  private baseUrl = `${environment.baseUrl}/TrackedPeriod`;

  constructor(private http: HttpClient) {}

  getAllTrackedPeriods() {
    const url = `${this.baseUrl}/user`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<TrackedPeriod[]>(url, { headers: headers });
  }

  getTrackedPeriod(id) {
    const url = `${this.baseUrl}/single/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<TrackedPeriod>(url, { headers: headers });
  }

  saveNewTrackedPeriod(tp: NewTrackedPeriod) {
    const url = `${this.baseUrl}/new`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, tp, { headers: headers });
  }
}
