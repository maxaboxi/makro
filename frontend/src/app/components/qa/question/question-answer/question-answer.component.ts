import { Component, OnInit, Input } from '@angular/core';
import { Answer } from '../../../../models/Answer';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../../../models/User';
import { QaService } from '../../../../services/qa.service';
import { LikeService } from '../../../../services/like.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Comment } from '../../../../models/Comment';
import { Like } from '../../../../models/Like';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-question-answer',
  templateUrl: './question-answer.component.html',
  styleUrls: ['./question-answer.component.css']
})
export class QuestionAnswerComponent implements OnInit {
  private _user = new BehaviorSubject<User>(null);
  private _answer = new BehaviorSubject<Answer>(null);
  private _showComment = new BehaviorSubject<boolean>(true);
  commentText = '';
  answerLikes: Like[];
  pointsTotal = 0;
  userLike = 0;
  loading = false;

  @Input()
  set user(user) {
    this._user.next(user);
  }

  get user() {
    return this._user.getValue();
  }

  @Input()
  set answer(q) {
    this._answer.next(q);
  }

  get answer() {
    return this._answer.getValue();
  }

  @Input()
  set showComment(b) {
    this._showComment.next(b);
  }

  get showComment() {
    return this._showComment.getValue();
  }

  constructor(
    private qaService: QaService,
    private likeService: LikeService,
    private modalService: NgbModal,
    private flashMessage: FlashMessagesService,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.pointsTotal = this.answer.totalPoints;
  }

  openCommentModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          const comment: Comment = {
            answerUUID: this.answer.uuid,
            username: this.user.username,
            userId: this.user.uuid,
            body: this.commentText
          };
          this.qaService.postNewComment(comment).subscribe(
            res => {
              if (res['success']) {
                this.fetchComments();
                this.flashMessage.show(this.translator.instant('COMMENT_ADDED'), {
                  cssClass: 'alert-success',
                  timeout: 2000
                });
                this.commentText = '';
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
          this.commentText = '';
        }
      },
      dismissed => {
        this.commentText = '';
      }
    );
  }

  like(c) {
    let like: Like = {
      userUUID: this.user.uuid,
      answerUUID: this.answer.uuid,
      value: 0
    };
    if (!this.userLike) {
      if (c === '+') {
        like.value = 1;
        this.userLike = 1;
        this.likeService.likePost(like).subscribe(res => {
          if (res['success']) {
            this.pointsTotal += like.value;
          }
        });
      }

      if (c === '-') {
        like.value = -1;
        this.userLike = -1;
        this.likeService.likePost(like).subscribe(res => {
          if (res['success']) {
            this.pointsTotal += like.value;
          }
        });
      }
    } else {
      if (c === '+') {
        like.value = 1;
        this.userLike = 1;
        this.likeService.replacePreviousLike(like).subscribe(res => {
          if (res['success']) {
            this.pointsTotal += 2;
          }
        });
      }

      if (c === '-') {
        like.value = -1;
        this.userLike = -1;
        this.likeService.replacePreviousLike(like).subscribe(res => {
          if (res['success']) {
            this.pointsTotal += -2;
          }
        });
      }
    }
  }

  fetchComments() {
    // this.qaService.getCommentsToAnswerWithId(this.answer.uuid).subscribe(comments => {
    //   this.answer.comments = comments;
    // });
  }
}
