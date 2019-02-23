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
import { ConnectionService } from '../../../../../services/connection.service';

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
  online;

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
    private translator: TranslateService,
    private connectionService: ConnectionService
  ) {}

  ngOnInit() {
    this.connectionService.monitor().subscribe(res => (this.online = res));
    this.userLike = this.comment.userLike;
  }

  openCommentModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          const comment: Comment = {
            replyToUUID: this.comment.uuid,
            username: this.user.username,
            userId: this.user.uuid,
            body: this.commentText,
            answerUUID: this.answer.uuid
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
      commentUUID: this.comment.uuid,
      value: c
    };
    if (this.userLike === 0) {
      this.likeService.likePost(like).subscribe(res => {
        if (res['success']) {
          this.comment.totalPoints += like.value;
          this.userLike = c;
        }
      });
    } else {
      this.likeService.replacePreviousLike(like, like.commentUUID).subscribe(res => {
        if (res['success']) {
          this.comment.totalPoints += like.value;
          this.comment.totalPoints += like.value;
          this.userLike = c;
        }
      });
    }
  }
}
