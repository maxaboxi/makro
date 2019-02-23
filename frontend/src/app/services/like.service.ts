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
    const url = `${this.baseUrl}/new`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, like, { headers: headers });
  }

  replacePreviousLike(like: Like, id: string) {
    const url = `${this.baseUrl}/update/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put(url, like, { headers: headers });
  }

  getAllUserLikesWithId() {
    const url = `${this.baseUrl}/user`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Like[]>(url, { headers: headers });
  }

  getAllLikesWithPostId(id) {
    const url = `${this.baseUrl}/all/${id}`;

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
