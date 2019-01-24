import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Comment } from '../../../../models/Comment';
import { User } from '../../../../models/User';
import { ArticleService } from '../../../../services/article.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';
import { VoteService } from '../../../../services/vote.service';
import { Article } from '../../../../models/Article';
import { Vote } from '../../../../models/Vote';
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
  userVote;
  votesFetched = false;
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
    private voteService: VoteService,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    if (this.article) {
      this.voteService.getAllVotesWithPostId(this.article._id).subscribe(votes => {
        votes.forEach(v => {
          if (v.userId === this.user._id) {
            v.vote > 0 ? (this.userVote = 'up') : (this.userVote = 'down');
          }
          this.pointsTotal += v.vote;
        });
        this.votesFetched = true;
      });
    }
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

  vote(c) {
    let vote: Vote = {
      userId: this.user._id,
      username: this.user.username,
      postId: this.comment._id,
      content: this.comment.comment,
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
        vote.vote = 2;
        this.userVote = 'up';
        this.voteService.replacePreviousVote(vote).subscribe(res => {
          if (res['success']) {
            this.pointsTotal += vote.vote;
          }
        });
      }

      if (c === '-') {
        vote.vote = -2;
        this.userVote = 'down';
        this.voteService.replacePreviousVote(vote).subscribe(res => {
          if (res['success']) {
            this.pointsTotal += vote.vote;
          }
        });
      }
    }
  }
}
