import { Component, OnInit } from '@angular/core';
import { Answer } from '../../../models/Answer';
import { AdminService } from '../../../services/admin.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';
import { QaService } from '../../../services/qa.service';

@Component({
  selector: 'app-admin-answers',
  templateUrl: './admin-answers.component.html',
  styleUrls: ['./admin-answers.component.css']
})
export class AdminAnswersComponent implements OnInit {
  answers: Answer[];
  propertiesToShow = [
    { name: 'username', date: false },
    { name: 'createdAt', date: true },
    { name: 'answer', date: false },
    { name: 'origPost', date: false }
  ];
  deletedAnswers = [];
  answersDeleted = false;

  constructor(
    private adminService: AdminService,
    private flashMessage: FlashMessagesService,
    private modalService: NgbModal,
    private translator: TranslateService,
    private qaService: QaService
  ) {}

  ngOnInit() {
    this.adminService.getAllAnswers().subscribe(answers => (this.answers = answers));
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
          this.adminService.getAllAnswers().subscribe(answers => (this.answers = answers));
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
}
