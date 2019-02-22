import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../../models/User';
import { Question } from '../../../models/Question';
import { QaService } from '../../../services/qa.service';
import { Answer } from '../../../models/Answer';
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
  loading = false;

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

  ngOnInit() {}

  openQuestion(qId) {
    this.router.navigate(['/question'], { queryParams: { id: qId } });
  }
}
