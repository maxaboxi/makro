import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';
import { QaService } from '../../services/qa.service';
import { Question } from '../../models/Question';

@Component({
  selector: 'app-qa',
  templateUrl: './qa.component.html',
  styleUrls: ['./qa.component.css']
})
export class QaComponent implements OnInit {
  user: User;
  questions: Question[];

  constructor(private auth: AuthService, private qaService: QaService) {}

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user = user;
      this.qaService
        .getAllQuestions()
        .subscribe(questions => (this.questions = questions));
    });
  }
}
