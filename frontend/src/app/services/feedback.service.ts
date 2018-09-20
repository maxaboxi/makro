import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Feedback } from '../models/Feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private baseUrl = 'https://api.makro.diet:1337/api/v1';

  constructor(private http: HttpClient) {}

  getAllFeedbacks() {
    const url = `${this.baseUrl}/getallfeedbacks`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Feedback[]>(url, { headers: headers });
  }

  submitFeedback(feedback: Feedback) {
    const url = `${this.baseUrl}/addnewfeedback`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, feedback, { headers: headers });
  }
}
