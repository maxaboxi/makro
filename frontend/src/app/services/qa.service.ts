import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Question } from '../models/Question';
import { Answer } from '../models/Answer';
import { Comment } from '../models/Comment';

@Injectable({
  providedIn: 'root'
})
export class QaService {
  private baseUrl = `${environment.baseUrl}/api/v1`;

  constructor(private http: HttpClient) {}

  getAllQuestions() {
    const url = `${this.baseUrl}/getallquestions`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Question[]>(url, { headers: headers });
  }

  getTopResponseToQuestion(questionId) {
    const url = `${this.baseUrl}/gettopresponsetoquestion`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<Answer>(
      url,
      { questionId: questionId },
      { headers: headers }
    );
  }

  getAllResponsesToQuestion(questionId) {
    const url = `${this.baseUrl}/getallresponsestoquestion`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<Answer[]>(
      url,
      { questionId: questionId },
      { headers: headers }
    );
  }

  postNewQuestion(question: Question) {
    const url = `${this.baseUrl}/postnewquestion`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, question, { headers: headers });
  }

  postNewComment(comment: Comment) {
    const url = `${this.baseUrl}/postnewquestion`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, comment, { headers: headers });
  }

  votePost(vote) {
    const url = `${this.baseUrl}/votepost`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, vote, { headers: headers });
  }

  addAnswerToQuestion(answer: Answer) {
    const url = `${this.baseUrl}/addanswertoquestion`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, answer, { headers: headers });
  }

  editQuestion(question: Question) {
    const url = `${this.baseUrl}/editquestion`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, question, { headers: headers });
  }

  editAnswer(answer: Answer) {
    const url = `${this.baseUrl}/editanswer`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, answer, { headers: headers });
  }

  removeQuestion(questionId) {
    const url = `${this.baseUrl}/removequestion`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      body: questionId
    };

    return this.http.delete(url, options);
  }

  removeAnswer(answerId) {
    const url = `${this.baseUrl}/removeanswer`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      body: answerId
    };

    return this.http.delete(url, options);
  }
}
