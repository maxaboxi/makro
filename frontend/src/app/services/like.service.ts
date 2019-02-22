import { Injectable } from '@angular/core';
import { Like } from '../models/Like';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private baseUrl = `${environment.baseUrl}/like`;

  constructor(private http: HttpClient) {}

  likePost(like: Like) {
    const url = `${this.baseUrl}/likepost`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, like, { headers: headers });
  }

  replacePreviousLike(like: Like) {
    const url = `${this.baseUrl}/replacepreviouslike`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, like, { headers: headers });
  }

  getUserLikeWithId(userId, postId) {
    const url = `${this.baseUrl}/getuserlikewithpostid`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const data = {
      userId: userId,
      postId: postId
    };

    return this.http.post<Like>(url, data, { headers: headers });
  }

  getAllUserLikesWithId(id) {
    const url = `${this.baseUrl}/getalllikeswithuserid/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Like[]>(url, { headers: headers });
  }

  getAllLikesWithPostId(id) {
    const url = `${this.baseUrl}/getalllikeswithpostid/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Like[]>(url, { headers: headers });
  }

  removeLikes(likeIds) {
    const url = `${this.baseUrl}/removelikes`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      body: likeIds
    };

    return this.http.delete(url, options);
  }
}