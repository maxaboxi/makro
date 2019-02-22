import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Comment } from '../../../../models/Comment';
import { User } from '../../../../models/User';
import { ArticleService } from '../../../../services/article.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';
import { LikeService } from '../../../../services/like.service';
import { Article } from '../../../../models/Article';
import { Like } from '../../../../models/Like';
import { TranslateService } from '@ngx-translate/core';

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
    private articleService: ArticleService,
    private modalService: NgbModal,
    private flashMessage: FlashMessagesService,
    private likeService: LikeService,
    private translator: TranslateService
  ) {}

  ngOnInit() {}

  openCommentModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          const comment: Comment = {
            postId: this.article.uuid,
            articleId: this.article.uuid,
            username: this.user.username,
            userId: this.user.uuid,
            comment: this.commentText,
            origPost: this.comment.comment,
            replyTo: this.comment.username
          };
          this.articleService.postNewComment(comment).subscribe(
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
