import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../../services/feedback.service';
import { Feedback } from '../../../models/Feedback';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/User';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-feedbacks',
  templateUrl: './admin-feedbacks.component.html',
  styleUrls: ['./admin-feedbacks.component.css']
})
export class AdminFeedbacksComponent implements OnInit {
  user: User;
  feedbacks: Feedback[];
  propertiesToShow = [{ name: 'username', date: false }, { name: 'createdAt', date: true }];
  selectedFeedback: Feedback;
  deletedFeedbacks = [];
  feedbacksDeleted = false;

  constructor(
    private feedbackService: FeedbackService,
    private flashMessage: FlashMessagesService,
    private modalService: NgbModal,
    private translator: TranslateService,
    private adminService: AdminService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => (this.user = user));
    this.feedbackService.getAllFeedbacks().subscribe(feedbacks => (this.feedbacks = feedbacks));
  }

  openFeedbackModal(content, feedback) {
    this.selectedFeedback = feedback;
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.selectedFeedback.answeredBy = this.user.username;
          this.adminService.submitAnswer(this.selectedFeedback).subscribe(
            res => {
              if (res['success']) {
                this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
                  cssClass: 'alert-success',
                  timeout: 2000
                });
                this.feedbackService.getAllFeedbacks().subscribe(feedbacks => (this.feedbacks = feedbacks));
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
        this.selectedFeedback = null;
      },
      dismissed => {
        this.selectedFeedback = null;
      }
    );
  }

  deleteFeedback(index) {
    this.deletedFeedbacks.push(this.feedbacks[index].uuid);
    this.feedbacks.splice(index, 1);
    this.feedbacksDeleted = true;
  }

  deleteFeedbacksFromDb() {
    this.adminService.removeFeedbacks(this.deletedFeedbacks).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.deletedFeedbacks = [];
          this.feedbacksDeleted = false;
          this.feedbackService.getAllFeedbacks().subscribe(feedbacks => (this.feedbacks = feedbacks));
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
