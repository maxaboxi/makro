import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Comment } from '../../../../models/Comment';
import { User } from '../../../../models/User';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';
import { LikeService } from '../../../../services/like.service';
import { Article } from '../../../../models/Article';
import { Like } from '../../../../models/Like';
import { TranslateService } from '@ngx-translate/core';
import { QaService } from '../../../../services/qa.service';
import { ConnectionService } from '../../../../services/connection.service';

@Component({
  selector: 'app-article-comment',
  templateUrl: './article-comment.component.html',
  styleUrls: ['./article-comment.component.css']
})
export class ArticleCommentComponent implements OnInit {
  private _comment = new BehaviorSubject<Comment>(null);
  private _user = new BehaviorSubject<User>(null);
  private _article = new BehaviorSubject<Article>(null);
  commentText = '';
  userLike = 0;
  pointsTotal = 0;
  online;

  @Input()
  set comment(c) {
    this._comment.next(c);
  }

  get comment() {
    return this._comment.getValue();
  }

  @Input()
  set user(u) {
    this._user.next(u);
  }

  get user() {
    return this._user.getValue();
  }

  @Input()
  set article(a) {
    this._article.next(a);
  }

  get article() {
    return this._article.getValue();
  }

  @Output()
  commented = new EventEmitter();

  constructor(
    private qaService: QaService,
    private modalService: NgbModal,
    private flashMessage: FlashMessagesService,
    private likeService: LikeService,
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
            username: this.user.username,
            userId: this.user.uuid,
            body: this.commentText,
            replyToUUID: this.comment.username
          };
          this.qaService.postNewComment(comment).subscribe(
            res => {
              if (res['success']) {
                this.commented.emit('commented');
                this.flashMessage.show(this.translator.instant('CHANGE_PASSWORDS_DONT_MATCH'), {
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
      this.likeService.replacePreviousLike(like, like.sharedMealUUID).subscribe(res => {
        if (res['success']) {
          this.comment.totalPoints += like.value;
          this.comment.totalPoints += like.value;
          this.userLike = c;
        }
      });
    }
  }
}
