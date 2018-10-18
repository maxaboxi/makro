import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Feedback } from '../models/Feedback';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private baseUrl = `${environment.baseUrl}/api/v1/feedbacks`;

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
