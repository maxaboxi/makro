import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from '../../../../models/User';
import { Comment } from '../../../../models/Comment';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommentService } from '../../../../services/comment.service';

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
    private commentService: CommentService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user = user;
      if (user.username) {
        this.commentService.getAllCommentsByUser().subscribe(comments => {
          this.comments = comments;
          this.loading = false;
        });
      }
    });
  }

  deleteComment(index) {
    this.deletedComments.push(this.comments[index].uuid);
    this.comments.splice(index, 1);
    this.commentsDeleted = true;
  }

  deleteCommentsFromDb() {
    this.commentService.removeComments(this.deletedComments).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.commentService.getAllCommentsByUser().subscribe(comments => {
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
      // queryParams: { id: comment.questionId }
    });
  }
}
