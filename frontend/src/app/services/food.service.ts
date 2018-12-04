import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Food } from '../models/Food';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private baseUrl = `${environment.foods}/api/v1/foods`;

  constructor(private http: HttpClient) {}

  getAllFoods() {
    const url = `${this.baseUrl}/getallfoods`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Food[]>(url, { headers: headers });
  }

  getFoodsByUserAndAdmin(user) {
    const url = `${this.baseUrl}/getfoods/${user}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Food[]>(url, { headers: headers });
  }

  getFoodsAddedByUser(user) {
    const url = `${this.baseUrl}/getfoodsbyuser/${user}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Food[]>(url, { headers: headers });
  }

  saveNewFood(food: Food) {
    const url = `${this.baseUrl}/addnewfood`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, food, { headers: headers });
  }

  editFood(food: Food) {
    const url = `${this.baseUrl}/editfood`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, food, { headers: headers });
  }

  removeFoods(foods) {
    const url = `${this.baseUrl}/removefoods`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      body: foods
    };

    return this.http.delete(url, options);
  }
}
