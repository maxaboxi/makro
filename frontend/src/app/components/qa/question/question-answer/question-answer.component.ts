import { Component, OnInit, Input } from '@angular/core';
import { Answer } from '../../../../models/Answer';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../../../models/User';
import { QaService } from '../../../../services/qa.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Comment } from '../../../../models/Comment';
import { Vote } from '../../../../models/Vote';

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
  showOnlyFirstComment = true;
  answerVotes: Vote[];
  pointsTotal;
  userVote;

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
    private modalService: NgbModal,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit() {
    if (this.answer) {
      this.pointsTotal = this.answer.pointsTotal;
      this.qaService
        .getCommentsToAnswerWithId(this.answer._id)
        .subscribe(comments => (this.answer.comments = comments));
      this.qaService
        .getUserVoteWithId(this.user._id, this.answer._id)
        .subscribe(vote => {
          if (vote[0]) {
            if (vote[0].vote > 0) {
              this.userVote = 'up';
            } else {
              this.userVote = 'down';
            }
          }
        });
    }
  }

  openCommentModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          const comment: Comment = {
            postId: this.answer._id,
            username: this.user.username,
            userId: this.user._id,
            comment: this.commentText,
            replyTo: this.answer._id,
            questionId: this.answer.questionId
          };
          this.qaService.postNewComment(comment).subscribe(
            res => {
              if (res['success']) {
                this.qaService
                  .getCommentsToAnswerWithId(this.answer._id)
                  .subscribe(comments => (this.answer.comments = comments));
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
      postId: this.answer._id,
      category: 'Answer',
      content: this.answer.answer,
      vote: 0
    };
    if (!this.userVote) {
      if (c === '+') {
        vote.vote = 1;
        this.userVote = 'up';
        this.qaService.votePost(vote).subscribe(res => {
          if (res['success']) {
            this.pointsTotal += vote.vote;
          }
        });
      }

      if (c === '-') {
        vote.vote = -1;
        this.userVote = 'down';
        this.qaService.votePost(vote).subscribe(res => {
          if (res['success']) {
            this.pointsTotal += vote.vote;
          }
        });
      }
    } else {
      if (c === '+') {
        vote.vote = 2;
        this.userVote = 'up';
        this.qaService.replacePreviousVote(vote).subscribe(res => {
          if (res['success']) {
            this.pointsTotal += vote.vote;
          }
        });
      }

      if (c === '-') {
        vote.vote = -2;
        this.userVote = 'down';
        this.qaService.replacePreviousVote(vote).subscribe(res => {
          if (res['success']) {
            this.pointsTotal += vote.vote;
          }
        });
      }
    }
  }

  fetchComments(e) {
    this.qaService
      .getCommentsToAnswerWithId(this.answer._id)
      .subscribe(comments => {
        this.answer.comments = comments;
      });
  }
}