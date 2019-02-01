import { Component, OnInit } from '@angular/core';
import { Question } from '../../../models/Question';
import { QaService } from '../../../services/qa.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-admin-questions',
  templateUrl: './admin-questions.component.html',
  styleUrls: ['./admin-questions.component.css']
})
export class AdminQuestionsComponent implements OnInit {
  questions: Question[];
  propertiesToShow = [
    { name: 'username', date: false },
    { name: 'createdAt', date: true },
    { name: 'question', date: false },
    { name: 'info', date: false }
  ];
  deletedQuestions = [];
  questionsDeleted = false;

  constructor(
    private qaService: QaService,
    private flashMessage: FlashMessagesService,
    private modalService: NgbModal,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.qaService.getAllQuestions().subscribe(questions => (this.questions = questions));
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
          this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.qaService.getAllQuestions().subscribe(questions => (this.questions = questions));
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
}
