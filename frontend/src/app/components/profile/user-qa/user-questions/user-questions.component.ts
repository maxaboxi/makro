import { Component, OnInit, Input } from '@angular/core';
import { Question } from '../../../../models/Question';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../../../models/User';
import { AuthService } from '../../../../services/auth.service';
import { QaService } from '../../../../services/qa.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-questions',
  templateUrl: './user-questions.component.html',
  styleUrls: ['./user-questions.component.css']
})
export class UserQuestionsComponent implements OnInit {
  user: User;
  questions: Question[] = [];
  deletedQuestions = [];
  questionsDeleted = false;
  loading = true;

  constructor(
    private auth: AuthService,
    private qaService: QaService,
    private flashMessage: FlashMessagesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user = user;
      if (user.username) {
        this.qaService.getAllUserQuestionsWithUsername(this.user.username).subscribe(questions => {
          this.questions = questions;
          this.loading = false;
        });
      }
    });
  }

  deleteQuestion(index) {
    this.deletedQuestions.push(this.questions[index]._id);
    this.questions.splice(index, 1);
    this.questionsDeleted = true;
  }

  deleteQuestionsFromDb() {
    this.qaService.removeQuestions(this.deletedQuestions).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show('Muutokset tallennettu.', {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.qaService.getAllUserQuestionsWithUsername(this.user.username).subscribe(questions => {
            this.questions = questions;
          });
          this.questionsDeleted = false;
        }
      },
      (error: Error) => {
        this.flashMessage.show(error['error'].msg, {
          cssClass: 'alert-danger',
          timeout: 2000
        });
      }
    );
  }

  navigate(question: Question) {
    this.router.navigate(['/question'], { queryParams: { id: question._id } });
  }
}
