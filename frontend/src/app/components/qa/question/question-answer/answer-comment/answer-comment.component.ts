import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Comment } from '../../../../../models/Comment';
import { User } from '../../../../../models/User';
import { QaService } from '../../../../../services/qa.service';
import { LikeService } from '../../../../../services/like.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Like } from '../../../../../models/Like';
import { Answer } from 'src/app/models/Answer';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-answer-comment',
  templateUrl: './answer-comment.component.html',
  styleUrls: ['./answer-comment.component.css']
})
export class AnswerCommentComponent implements OnInit {
  private _comment = new BehaviorSubject<Comment>(null);
  private _user = new BehaviorSubject<User>(null);
  private _answer = new BehaviorSubject<Answer>(null);
  commentText = '';
  commentLikes: Like[];
  pointsTotal = 0;
  userLike = 0;
  likesFetched = false;
  loading = true;

  @Input()
  set comment(comment) {
    this._comment.next(comment);
  }

  get comment() {
    return this._comment.getValue();
  }

  @Input()
  set user(user) {
    this._user.next(user);
  }

  get user() {
    return this._user.getValue();
  }

  @Input()
  set answer(answer) {
    this._answer.next(answer);
  }

  get answer() {
    return this._answer.getValue();
  }

  @Output()
  commented = new EventEmitter<any>();

  constructor(
    private qaService: QaService,
    private likeService: LikeService,
    private modalService: NgbModal,
    private flashMessage: FlashMessagesService,
    private translator: TranslateService
  ) {}

  ngOnInit() {}

  openCommentModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          const comment: Comment = {
            postId: this.comment.postId,
            replyTo: this.comment.username,
            username: this.user.username,
            userId: this.user.uuid,
            comment: this.commentText,
            origPost: this.comment.comment,
            questionId: this.answer.questionId
          };
          this.qaService.postNewComment(comment).subscribe(
            res => {
              if (res['success']) {
                this.commented.emit(true);
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
}
