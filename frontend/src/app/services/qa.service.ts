import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Question } from '../models/Question';
import { Answer } from '../models/Answer';

@Injectable({
  providedIn: 'root'
})
export class QaService {
  private baseUrlQuestion = `${environment.baseUrl}/question`;
  private baseUrlAnswer = `${environment.baseUrl}/answer`;

  constructor(private http: HttpClient) {}

  getAllQuestions() {
    const url = `${this.baseUrlQuestion}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Question[]>(url, { headers: headers });
  }

  getQuestionWithId(id) {
    const url = `${this.baseUrlQuestion}/single/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Question>(url, { headers: headers });
  }

  postNewQuestion(question: Question) {
    const url = `${this.baseUrlQuestion}/new`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, question, { headers: headers });
  }

  addAnswerToQuestion(answer: Answer) {
    const url = `${this.baseUrlAnswer}/new`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, answer, { headers: headers });
  }

  getAllUserQuestionsByUser() {
    const url = `${this.baseUrlQuestion}/user`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Question[]>(url, { headers: headers });
  }

  getAllUserAnswersByUser() {
    const url = `${this.baseUrlAnswer}/user`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Answer[]>(url, { headers: headers });
  }

  editQuestion(question: Question) {
    const url = `${this.baseUrlQuestion}/update/${question.uuid}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, question, { headers: headers });
  }

  editAnswer(answer: Answer) {
    const url = `${this.baseUrlAnswer}/update/${answer.uuid}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, answer, { headers: headers });
  }

  removeQuestions(questionIds) {
    const url = `${this.baseUrlQuestion}/delete/multiple`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      body: questionIds
    };

    return this.http.delete(url, options);
  }

  removeAnswers(answerIds) {
    const url = `${this.baseUrlAnswer}/delete/multiple`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      body: answerIds
    };

    return this.http.delete(url, options);
  }
}
