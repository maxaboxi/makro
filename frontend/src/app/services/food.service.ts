import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Food } from '../models/Food';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private baseUrl = 'http://localhost:1337/api/v1';

  constructor(private http: HttpClient) {}

  getFoods() {
    const url = `${this.baseUrl}/getallfoods`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Food[]>(url, { headers: headers });
  }
}
