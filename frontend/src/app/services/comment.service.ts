import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Comment } from '../models/Comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = `${environment.baseUrl}/comment`;

  constructor(private http: HttpClient) {}

  postNewComment(comment: Comment) {
    const url = `${this.baseUrl}/new`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, comment, { headers: headers });
  }

  updateComment(comment: Comment) {
    const url = `${this.baseUrl}/update/${comment.uuid}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put(url, comment, { headers: headers });
  }

  getAllCommentsByUser() {
    const url = `${this.baseUrl}/user`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Comment[]>(url, { headers: headers });
  }

  getAllCommentsForAnswer(uuid: string) {
    const url = `${this.baseUrl}/answer/${uuid}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Comment[]>(url, { headers: headers });
  }

  getAllCommentsForArticle(uuid: string) {
    const url = `${this.baseUrl}/article/${uuid}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Comment[]>(url, { headers: headers });
  }

  removeComments(commentIds) {
    const url = `${this.baseUrl}/delete/multiple`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      body: commentIds
    };

    return this.http.delete(url, options);
  }
}
