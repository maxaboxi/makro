import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Meal } from '../models/Meal';

@Injectable({
  providedIn: 'root'
})
export class SharedMealsService {
  private baseUrl = `${environment.baseUrl}/meal`;

  constructor(private http: HttpClient) {}

  getAllMeals() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}`;

    return this.http.get<Meal[]>(url, { headers: headers });
  }

  getSingleMeal(id) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/single/${id}`;

    return this.http.get<Meal>(url, { headers: headers });
  }

  getMealsByUser() {
    const url = `${this.baseUrl}/user`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Meal[]>(url, { headers: headers });
  }

  shareNewMeal(meal: Meal) {
    const url = `${this.baseUrl}/new`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, meal, { headers: headers });
  }

  saveEditedMeal(meal: Meal) {
    const url = `${this.baseUrl}/update/${meal.uuid}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put(url, meal, { headers: headers });
  }

  removeMeals(meals) {
    const url = `${this.baseUrl}/delete/multiple`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      body: meals
    };

    return this.http.delete(url, options);
  }

  getMultipleSavedMeals(ids: string[]) {
    const url = `${this.baseUrl}/multiple/`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<Meal[]>(url, ids, { headers: headers });
  }
}
