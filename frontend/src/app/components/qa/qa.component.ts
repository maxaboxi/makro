import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';
import { QaService } from '../../services/qa.service';
import { Question } from '../../models/Question';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-qa',
  templateUrl: './qa.component.html',
  styleUrls: ['./qa.component.css']
})
export class QaComponent implements OnInit {
  user: User;
  questions: Question[];
  question: Question = {
    username: '',
    question: '',
    info: '',
    tags: []
  };
  questionTag = '';

  constructor(
    private auth: AuthService,
    private qaService: QaService,
    private modalService: NgbModal,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user = user;
      this.qaService
        .getAllQuestions()
        .subscribe(questions => (this.questions = questions));
    });
  }

  resetForm() {
    this.question.question = '';
    this.question.tags = [];
    this.question.info = '';
  }

  openModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.question.username = this.user.username;
          this.qaService.postNewQuestion(this.question).subscribe(
            res => {
              if (res['success']) {
                this.flashMessage.show('Kysymys lisätty', {
                  cssClass: 'alert-success',
                  timeout: 2000
                });
                this.qaService
                  .getAllQuestions()
                  .subscribe(questions => (this.questions = questions));
                this.resetForm();
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
          this.resetForm();
        }
      },
      dismissed => {
        this.resetForm();
      }
    );
  }

  addTagToQuestionTags(char) {
    if (this.questionTag.length >= 3 && char === ',') {
      this.question.tags.push(
        this.questionTag.slice(0, this.questionTag.length - 1)
      );
      this.questionTag = '';
    }
  }

  removeTagFromQuestionTags(index) {
    this.question.tags.splice(index, 1);
  }
}
