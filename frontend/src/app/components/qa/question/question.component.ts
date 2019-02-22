import { Component, OnInit } from '@angular/core';
import { QaService } from '../../../services/qa.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from '../../../models/User';
import { AuthService } from '../../../services/auth.service';
import { Question } from '../../../models/Question';
import { Answer } from '../../../models/Answer';
import { Comment } from '../../../models/Comment';
import { Like } from '../../../models/Like';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  user: User;
  answerText = '';
  commentText = '';
  question: Question;
  answer: Answer;
  answers: Answer[];
  queryParams = {};
  loading = true;

  constructor(
    private auth: AuthService,
    private qaService: QaService,
    private modalService: NgbModal,
    private flashMessage: FlashMessagesService,
    private route: ActivatedRoute,
    private router: Router,
    private translator: TranslateService
  ) {
    this.route.queryParams.subscribe(qp => {
      Object.keys(qp).forEach(param => {
        this.queryParams[param] = qp[param];
      });
    });
  }

  ngOnInit() {
    this.auth.user.subscribe(user => (this.user = user));
    if (Object.keys(this.queryParams).length > 0) {
      this.qaService.getQuestionWithId(this.queryParams['id']).subscribe(
        q => {
          this.question = q;
        },
        (error: Error) => {
          this.loading = false;
          this.flashMessage.show(this.translator.instant('NETWORK_LOADING_ERROR'), {
            cssClass: 'alert-danger',
            timeout: 2000
          });
        }
      );
      this.qaService.getAllResponsesToQuestion(this.queryParams['id']).subscribe(
        a => {
          this.answers = a;
          this.loading = false;
        },
        (error: Error) => {
          this.loading = false;
          this.flashMessage.show(this.translator.instant('NETWORK_LOADING_ERROR'), {
            cssClass: 'alert-danger',
            timeout: 2000
          });
        }
      );
    } else {
      this.router.navigate(['/qa']);
    }
  }

  openAnswerModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          const answer: Answer = {
            username: this.user.username,
            answer: this.answerText,
            questionId: this.question.uuid,
            origPost: this.question.question
          };
          this.qaService.addAnswerToQuestion(answer).subscribe(
            res => {
              if (res['success']) {
                this.qaService.getAllResponsesToQuestion(this.question.uuid).subscribe(answers => (this.answers = answers));
                this.flashMessage.show('Vastaus lisätty', {
                  cssClass: 'alert-success',
                  timeout: 2000
                });

                this.answerText = '';
              }
            },
            (error: Error) => {
              this.flashMessage.show(error['error'].msg, {
                cssClass: 'alert-danger',
                timeout: 2000
              });
            }
          );
        } else {
          this.answerText = '';
        }
      },
      dismissed => {
        this.answerText = '';
      }
    );
  }
}
