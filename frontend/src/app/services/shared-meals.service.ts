import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Meal } from '../models/Meal';

@Injectable({
  providedIn: 'root'
})
export class SharedMealsService {
  private baseUrl = `${environment.baseUrl}/api/v1`;

  constructor(private http: HttpClient) {}

  getAllMeals() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/getallsharedmeals`;

    return this.http.get<Meal[]>(url, { headers: headers });
  }

  getMealsByUser(user) {
    const url = `${this.baseUrl}/getsharedmeals/${user}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Meal[]>(url, { headers: headers });
  }

  shareNewMeal(meal: Meal) {
    const url = `${this.baseUrl}/addnewsharedmeal`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, meal, { headers: headers });
  }

  saveEditedMeal(meal) {
    const url = `${this.baseUrl}/saveeditedsharedmeal`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, meal, { headers: headers });
  }

  removeMeals(meals) {
    const url = `${this.baseUrl}/removesharedmeals`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      body: meals
    };

    return this.http.delete(url, options);
  }
}