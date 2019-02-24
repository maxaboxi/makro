import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Food } from '../models/Food';
import { environment } from '../../environments/environment';
import { EditedFood } from '../models/EditedFood';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private baseUrl = `${environment.baseUrl}/food`;

  constructor(private http: HttpClient) {}

  getAllFoods() {
    const url = `${this.baseUrl}/all`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Food[]>(url, { headers: headers });
  }

  getFoodsExcludeOtherUsers() {
    const url = `${this.baseUrl}/exclude`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Food[]>(url, { headers: headers });
  }

  getFoodsAddedByUser() {
    const url = `${this.baseUrl}/user`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Food[]>(url, { headers: headers });
  }

  saveNewFood(food: Food) {
    const url = `${this.baseUrl}/new`;

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

  getFoodsCount() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/amount`;

    return this.http.get(url, { headers: headers });
  }

  sentForApproval(foods: EditedFood[]) {
    const url = `${this.baseUrl}/sendforapproval`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, { foods: foods }, { headers: headers });
  }
}
