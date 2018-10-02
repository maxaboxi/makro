import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../../models/User';
import { Question } from '../../../models/Question';
import { QaService } from '../../../services/qa.service';
import { Answer } from '../../../models/Answer';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  private _user = new BehaviorSubject<User>(null);
  private _question = new BehaviorSubject<Question>(null);
  answers: Answer[];

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

  constructor(private qaService: QaService) {}

  ngOnInit() {
    this.qaService
      .getAllResponsesToQuestion(this.question._id)
      .subscribe(answers => (this.answers = answers));
  }
}
