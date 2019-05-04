import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Food } from '../models/Food';
import { environment } from '../../environments/environment';
import { EditedFood } from '../models/EditedFood';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private baseUrl = `${environment.baseUrl}/food`;
  allFoods = new BehaviorSubject<Food[]>(null);
  excludedFoods = new BehaviorSubject<Food[]>(null);

  constructor(private http: HttpClient) {}

  getAllFoods() {
    if (this.allFoods.getValue() == null) {
      const url = `${this.baseUrl}/all`;

      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      this.http.get<Food[]>(url, { headers: headers }).subscribe(foods => this.allFoods.next(foods));
    }
  }

  getFoodsExcludeOtherUsers() {
    if (this.excludedFoods.getValue() == null) {
      const url = `${this.baseUrl}/exclude`;

      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      this.http.get<Food[]>(url, { headers: headers }).subscribe(foods => this.excludedFoods.next(foods));
    }
  }

  updateFoods() {
    const url = `${this.baseUrl}/all`;
    const urlExclude = `${this.baseUrl}/exclude`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.get<Food[]>(urlExclude, { headers: headers }).subscribe(foods => this.excludedFoods.next(foods));
    this.http.get<Food[]>(url, { headers: headers }).subscribe(foods => this.allFoods.next(foods));
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
    const url = `${this.baseUrl}/update/${food.uuid}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put(url, food, { headers: headers });
  }

  removeFoods(foods) {
    const url = `${this.baseUrl}/delete/multiple`;

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
