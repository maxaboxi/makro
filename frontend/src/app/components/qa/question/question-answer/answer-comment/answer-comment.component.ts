import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Comment } from '../../../../../models/Comment';
import { User } from '../../../../../models/User';
import { QaService } from '../../../../../services/qa.service';
import { VoteService } from '../../../../../services/vote.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Vote } from '../../../../../models/Vote';
import { Answer } from 'src/app/models/Answer';

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
  commentVotes: Vote[];
  pointsTotal;
  userVote;

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
    private voteService: VoteService,
    private modalService: NgbModal,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit() {
    this.pointsTotal = this.comment.pointsTotal;
    this.voteService
      .getUserVoteWithId(this.user._id, this.comment._id)
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

  openCommentModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          const comment: Comment = {
            postId: this.comment.postId,
            replyTo: this.comment.username,
            username: this.user.username,
            userId: this.user._id,
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

  vote(c) {
    let vote: Vote = {
      userId: this.user._id,
      username: this.user.username,
      postId: this.comment._id,
      category: 'Comment',
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
