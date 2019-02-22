import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { QaService } from '../../../../services/qa.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from '../../../../models/User';
import { Answer } from '../../../../models/Answer';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-answers',
  templateUrl: './user-answers.component.html',
  styleUrls: ['./user-answers.component.css']
})
export class UserAnswersComponent implements OnInit {
  user: User;
  answers: Answer[] = [];
  deletedAnswers = [];
  answersDeleted = false;
  loading = true;

  constructor(
    private auth: AuthService,
    private qaService: QaService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user = user;
      if (user.username) {
        this.qaService.getAllUserAnswersWithUsername(this.user.username).subscribe(answers => {
          this.answers = answers;
          this.loading = false;
        });
      }
    });
  }

  deleteAnswer(index) {
    this.deletedAnswers.push(this.answers[index].uuid);
    this.answers.splice(index, 1);
    this.answersDeleted = true;
  }

  deleteAnswersFromDb() {
    this.qaService.removeAnswers(this.deletedAnswers).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.qaService.getAllUserAnswersWithUsername(this.user.username).subscribe(answers => {
            this.answers = answers;
          });
          this.answersDeleted = false;
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

  navigate(answer: Answer) {
    this.router.navigate(['/question'], {
      queryParams: { id: answer.questionId }
    });
  }
}
