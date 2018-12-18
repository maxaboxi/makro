import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Article } from '../../../models/Article';
import { User } from '../../../models/User';
import { BehaviorSubject } from 'rxjs';
import { ArticleService } from '../../../services/article.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';
import { VoteService } from '../../../services/vote.service';
import { Vote } from '../../../models/Vote';
import { AuthService } from '../../../services/auth.service';
import { Comment } from '../../../models/Comment';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  private _user = new BehaviorSubject<User>(null);
  private _article = new BehaviorSubject<Article>(null);
  image: Blob;
  votesFetched = false;
  votes: Vote[];
  userVote;
  pointsTotal = 0;
  queryParams = {};
  singleArticle = false;
  commentText = '';
  comments;

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
    private voteService: VoteService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(qp => {
      Object.keys(qp).forEach(param => {
        this.queryParams[param] = qp[param];
      });
    });
  }

  ngOnInit() {
    if (Object.keys(this.queryParams).length > 0) {
      this.singleArticle = true;
      this.auth.user.subscribe(user => {
        this.user = user;
        this.articleService.getArticleById(this.queryParams['id']).subscribe(a => {
          this._article.next(a[0]);
          this.initializeArticle();
          this.articleService.getCommentsToArticleWithId(this.article._id).subscribe(comments => (this.comments = comments));
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
    this.voteService.getAllVotesWithPostId(this.article._id).subscribe(votes => {
      this.votes = votes;
      this.votes.forEach(v => {
        this.pointsTotal += v.vote;
        if (v.userId === this.user._id) {
          v.vote > 0 ? (this.userVote = 'up') : (this.userVote = 'down');
        }
      });
      this.votesFetched = true;
    });
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
    this.router.navigate(['/article'], { queryParams: { id: this.article._id } });
  }

  editArticle() {
    this.router.navigate(['/articles/addarticle'], {
      queryParams: { _id: this.article._id }
    });
  }

  fetchComments() {
    this.articleService.getCommentsToArticleWithId(this.article._id).subscribe(comments => (this.comments = comments));
  }

  openDeleteArticleModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.articleService.deleteArticle(this.article._id).subscribe(res => {
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
            postId: this.article._id,
            articleId: this.article._id,
            username: this.user.username,
            userId: this.user._id,
            comment: this.commentText,
            origPost: this.article.body
          };
          this.articleService.postNewComment(comment).subscribe(
            res => {
              if (res['success']) {
                this.fetchComments();
                this.flashMessage.show('Kommentti lisätty', {
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

  vote(c) {
    let vote: Vote = {
      userId: this.user._id,
      username: this.user.username,
      postId: this.article._id,
      content: this.article.title,
      vote: 0
    };
    if (!this.userVote) {
      if (c === '+') {
        vote.vote = 1;
        this.userVote = 'up';
        this.voteService.votePost(vote).subscribe(res => {
          if (res['success']) {
            this.pointsTotal += vote.vote;
          }
        });
      }

      if (c === '-') {
        vote.vote = -1;
        this.userVote = 'down';
        this.voteService.votePost(vote).subscribe(res => {
          if (res['success']) {
            this.pointsTotal += vote.vote;
          }
        });
      }
    } else {
      if (c === '+') {
        vote.vote = 1;
        this.userVote = 'up';
        this.voteService.replacePreviousVote(vote).subscribe(res => {
          if (res['success']) {
            this.pointsTotal += 2;
          }
        });
      }

      if (c === '-') {
        vote.vote = -1;
        this.userVote = 'down';
        this.voteService.replacePreviousVote(vote).subscribe(res => {
          if (res['success']) {
            this.pointsTotal += -2;
          }
        });
      }
    }
  }
}
