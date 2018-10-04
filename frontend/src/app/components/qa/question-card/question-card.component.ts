import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../../models/User';
import { Question } from '../../../models/Question';
import { QaService } from '../../../services/qa.service';
import { Answer } from '../../../models/Answer';
import { Vote } from '../../../models/Vote';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question-card',
  templateUrl: './question-card.component.html',
  styleUrls: ['./question-card.component.css']
})
export class QuestionCardComponent implements OnInit {
  private _user = new BehaviorSubject<User>(null);
  private _question = new BehaviorSubject<Question>(null);
  answers: Answer[];
  answer: Answer;

  @Input()
  set user(user) {
    this._user.next(user);
  }

  get user() {
    return this._user.getValue();
  }

  @Input()
  set question(q) {
    this._question.next(q);
  }

  get question() {
    return this._question.getValue();
  }

  constructor(private qaService: QaService, private router: Router) {}

  ngOnInit() {
    this.qaService
      .getTopResponseToQuestion(this.question._id)
      .subscribe(answer => {
        this.answer = answer[0];
      });
  }

  openQuestion(qId) {
    this.router.navigate(['/question'], { queryParams: { id: qId } });
  }

  vote(c) {
    let vote: Vote = {
      userId: this.user._id,
      username: this.user.username,
      postId: this.answer._id,
      vote: 0
    };
    if (c === '+') {
      vote.vote = 1;
      this.qaService.votePost(vote).subscribe(res => {
        console.log(res);
      });
    }

    if (c === '-') {
      vote.vote = -1;
      this.qaService.votePost(vote).subscribe(res => {
        console.log(res);
      });
    }
  }
}
