import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { QaService } from '../../../../services/qa.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from '../../../../models/User';
import { Comment } from '../../../../models/Comment';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-comments',
  templateUrl: './user-comments.component.html',
  styleUrls: ['./user-comments.component.css']
})
export class UserCommentsComponent implements OnInit {
  user: User;
  comments: Comment[] = [];
  deletedComments = [];
  commentsDeleted = false;
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
        this.qaService.getAllUserCommentsWithId(this.user._id).subscribe(comments => {
          this.comments = comments;
          this.loading = false;
        });
      }
    });
  }

  deleteComment(index) {
    this.deletedComments.push(this.comments[index]._id);
    this.comments.splice(index, 1);
    this.commentsDeleted = true;
  }

  deleteCommentsFromDb() {
    this.qaService.removeComments(this.deletedComments).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.qaService.getAllUserCommentsWithId(this.user._id).subscribe(comments => {
            this.comments = comments;
          });
          this.commentsDeleted = false;
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

  navigate(comment: Comment) {
    this.router.navigate(['/question'], {
      queryParams: { id: comment.questionId }
    });
  }
}
