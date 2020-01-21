import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Statistics } from '../models/Statistics';
import { UserPdf } from '../models/UserPdf';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private baseUrl = `${environment.baseUrl}/statistics`;
  constructor(private http: HttpClient) {}

  getStats() {
    const url = `${this.baseUrl}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Statistics>(url, { headers: headers });
  }

  CreatePDF(userPdf: UserPdf) {
    const url = `${this.baseUrl}/pdf`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, userPdf, { headers: headers });
  }

  getAmountOfPdfCreatedByUser() {
    const url = `${this.baseUrl}/user`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get(url, { headers: headers });
  }
}
