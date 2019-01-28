import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';
import { Feedback } from '../../models/Feedback';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  user: User;
  feedbacks: Feedback[];
  feedback: Feedback = {
    feedback: '',
    username: 'Nimetön'
  };
  loading = true;
  online;

  constructor(
    private feedbackService: FeedbackService,
    private modalService: NgbModal,
    private auth: AuthService,
    private flashMessage: FlashMessagesService,
    private translator: TranslateService,
    private connectionService: ConnectionService
  ) {}

  ngOnInit() {
    this.connectionService.monitor().subscribe(res => (this.online = res));
    this.getAllFeedbacks();
    this.auth.user.subscribe(user => (this.user = user));
  }

  getAllFeedbacks() {
    this.feedbackService.getAllFeedbacks().subscribe(
      feedbacks => {
        this.feedbacks = feedbacks;
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
  }

  resetForm() {
    this.feedback.username = 'Nimetön';
    this.feedback.feedback = '';
  }

  openModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.feedbackService.submitFeedback(this.feedback).subscribe(
            res => {
              if (res['success']) {
                this.flashMessage.show(this.translator.instant('FEEDBACK_SAVED'), {
                  cssClass: 'alert-success',
                  timeout: 2000
                });
                this.getAllFeedbacks();
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
}
