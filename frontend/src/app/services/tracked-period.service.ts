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

  getLastSevenDays() {
    const url = `${this.baseUrl}/single/7`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<TrackedPeriod>(url, { headers: headers });
  }

  getTrackedPeriod(id: string) {
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

  saveEditedTrackedPeriod(tp: NewTrackedPeriod) {
    const url = `${this.baseUrl}/update/${tp.uuid}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put(url, tp, { headers: headers });
  }

  removeTrackedPeriods(tpIds: string[]) {
    const url = `${this.baseUrl}/delete/multiple`;

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
