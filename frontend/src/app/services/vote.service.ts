import { Injectable } from '@angular/core';
import { Vote } from '../models/Vote';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  private baseUrl = `${environment.baseUrl}/api/v1/votes`;

  constructor(private http: HttpClient) {}

  votePost(vote: Vote) {
    const url = `${this.baseUrl}/votepost`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, vote, { headers: headers });
  }

  replacePreviousVote(vote: Vote) {
    const url = `${this.baseUrl}/replacepreviousvote`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, vote, { headers: headers });
  }

  getUserVoteWithId(userId, postId) {
    const url = `${this.baseUrl}/getuservotewithpostid`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const data = {
      userId: userId,
      postId: postId
    };

    return this.http.post<Vote>(url, data, { headers: headers });
  }

  getAllUserVotesWithId(id) {
    const url = `${this.baseUrl}/getallvoteswithuserid/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Vote[]>(url, { headers: headers });
  }

  removeVotes(voteIds) {
    const url = `${this.baseUrl}/removevotes`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      body: voteIds
    };

    return this.http.delete(url, options);
  }
}
