import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Question } from '../models/Question';
import { Answer } from '../models/Answer';
import { Comment } from '../models/Comment';
import { Vote } from '../models/Vote';

@Injectable({
  providedIn: 'root'
})
export class QaService {
  private baseUrl = `${environment.baseUrl}/api/v1/qa`;

  constructor(private http: HttpClient) {}

  getAllQuestions() {
    const url = `${this.baseUrl}/questions/getallquestions`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Question[]>(url, { headers: headers });
  }

  getQuestionWithId(id) {
    const url = `${this.baseUrl}/questions/getquestion/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Question>(url, { headers: headers });
  }

  getCommentsToAnswerWithId(id) {
    const url = `${this.baseUrl}/comments/getallcomments/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Comment[]>(url, { headers: headers });
  }

  getTopResponseToQuestion(questionId) {
    const url = `${this.baseUrl}/answers/gettopresponsetoquestion`;

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
    const url = `${this.baseUrl}/answers/getallresponsestoquestion`;

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
    const url = `${this.baseUrl}/questions/postnewquestion`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, question, { headers: headers });
  }

  postNewComment(comment: Comment) {
    const url = `${this.baseUrl}/comments/addcomment`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, comment, { headers: headers });
  }

  votePost(vote: Vote) {
    const url = `${this.baseUrl}/votes/votepost`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, vote, { headers: headers });
  }

  replacePreviousVote(vote: Vote) {
    const url = `${this.baseUrl}/votes/replacepreviousvote`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, vote, { headers: headers });
  }

  getUserVoteWithId(userId, postId) {
    const url = `${this.baseUrl}/votes/getuservotewithpostid`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const data = {
      userId: userId,
      postId: postId
    };

    return this.http.post<Vote>(url, data, { headers: headers });
  }

  addAnswerToQuestion(answer: Answer) {
    const url = `${this.baseUrl}/answers/addanswertoquestion`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, answer, { headers: headers });
  }

  getAllUserVotesWithId(id) {
    const url = `${this.baseUrl}/votes/getallvoteswithuserid/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Vote[]>(url, { headers: headers });
  }

  getAllUserQuestionsWithUsername(username) {
    const url = `${
      this.baseUrl
    }/questions/getallquestionswithusername/${username}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Question[]>(url, { headers: headers });
  }

  getAllUserAnswersWithUsername(username) {
    const url = `${this.baseUrl}/answers/getallanswerswithusername/${username}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Answer[]>(url, { headers: headers });
  }

  getAllUserCommentsWithId(id) {
    const url = `${this.baseUrl}/comments/getallcommentswithuserid/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Comment[]>(url, { headers: headers });
  }

  editQuestion(question: Question) {
    const url = `${this.baseUrl}/questions/editquestion`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, question, { headers: headers });
  }

  editAnswer(answer: Answer) {
    const url = `${this.baseUrl}/answers/editanswer`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, answer, { headers: headers });
  }

  removeQuestions(questionIds) {
    const url = `${this.baseUrl}/questions/removequestions`;

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
    const url = `${this.baseUrl}/answers/removeanswers`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      body: answerIds
    };

    return this.http.delete(url, options);
  }

  removeComments(commentIds) {
    const url = `${this.baseUrl}/comments/removecomments`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      body: commentIds
    };

    return this.http.delete(url, options);
  }

  removeVotes(voteIds) {
    const url = `${this.baseUrl}/votes/removevotes`;

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
