import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Article } from '../../../models/Article';
import { User } from '../../../models/User';
import { BehaviorSubject } from 'rxjs';
import { ArticleService } from '../../../services/article.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';
import { LikeService } from '../../../services/like.service';
import { Like } from '../../../models/Like';
import { AuthService } from '../../../services/auth.service';
import { Comment } from '../../../models/Comment';
import { TranslateService } from '@ngx-translate/core';
import { ConnectionService } from '../../../services/connection.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  private _user = new BehaviorSubject<User>(null);
  private _article = new BehaviorSubject<Article>(null);
  image;
  likesFetched = false;
  likes: Like[];
  userLike = 0;
  pointsTotal = 0;
  queryParams = {};
  singleArticle = false;
  commentText = '';
  comments;
  loading = true;
  online;

  @Input()
  set user(user) {
    this._user.next(user);
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
  deleted = new EventEmitter();

  constructor(
    private auth: AuthService,
    private articleService: ArticleService,
    private router: Router,
    private modalService: NgbModal,
    private flashMessage: FlashMessagesService,
    private likeService: LikeService,
    private route: ActivatedRoute,
    private translator: TranslateService,
    private connectionService: ConnectionService
  ) {
    this.route.queryParams.subscribe(qp => {
      Object.keys(qp).forEach(param => {
        this.queryParams[param] = qp[param];
      });
    });
  }

  ngOnInit() {
    this.connectionService.monitor().subscribe(res => (this.online = res));
    if (Object.keys(this.queryParams).length > 0) {
      this.singleArticle = true;
      this.auth.user.subscribe(user => {
        this.user = user;
        this.articleService.getArticleById(this.queryParams['id']).subscribe(a => {
          this._article.next(a[0]);
          this.initializeArticle();
          this.articleService.getCommentsToArticleWithId(this.article.uuid).subscribe(comments => (this.comments = comments));
        });
      });
    } else {
      this.initializeArticle();
    }
  }

  initializeArticle() {
    if (this.article.headerImgId) {
      this.articleService.getImageForArticle(this.article.headerImgId).subscribe(res => {
        if (res) {
          this.createImageFromBlob(res);
        }
      });
    }
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.image = reader.result;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  openArticle() {
    this.router.navigate(['/article'], { queryParams: { id: this.article.uuid } });
  }

  editArticle() {
    this.router.navigate(['/articles/addarticle'], {
      queryParams: { uuid: this.article.uuid }
    });
  }

  fetchComments() {
    this.articleService.getCommentsToArticleWithId(this.article.uuid).subscribe(comments => (this.comments = comments));
  }

  openDeleteArticleModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.articleService.deleteArticle(this.article.uuid).subscribe(res => {
            this.flashMessage.show(res['msg'], {
              cssClass: res['success'] ? 'alert-success' : 'alert-danger',
              timeout: 2000
            });
            if (res['success']) {
              this.deleted.emit('deleted');
            }
          });
        }
      },
      dismissed => {}
    );
  }

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
            origPost: this.article.body
          };
          this.articleService.postNewComment(comment).subscribe(
            res => {
              if (res['success']) {
                this.fetchComments();
                this.flashMessage.show(this.translator.instant('COMMENT_SAVED'), {
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
      articleUUID: this.article.uuid,
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
