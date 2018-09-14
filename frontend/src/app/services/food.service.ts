import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Food } from '../models/Food';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private baseUrl = 'http://localhost:1337/api/v1';

  constructor(private http: HttpClient) {}

  getAllFoods() {
    const url = `${this.baseUrl}/getallfoods`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Food[]>(url, { headers: headers });
  }

  getFoods(user) {
    const url = `${this.baseUrl}/getfoods/${user}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Food[]>(url, { headers: headers });
  }

  getUserAddedFoods(user) {
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

  removeFood(foodId: String) {
    const url = `${this.baseUrl}/removefood/${foodId}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.delete(url, { headers: headers });
  }
}
