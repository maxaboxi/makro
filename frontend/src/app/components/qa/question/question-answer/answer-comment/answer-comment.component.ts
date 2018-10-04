import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Comment } from '../../../../../models/Comment';
import { User } from '../../../../../models/User';
import { QaService } from '../../../../../services/qa.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Vote } from '../../../../../models/Vote';

@Component({
  selector: 'app-answer-comment',
  templateUrl: './answer-comment.component.html',
  styleUrls: ['./answer-comment.component.css']
})
export class AnswerCommentComponent implements OnInit {
  private _comment = new BehaviorSubject<Comment>(null);
  private _user = new BehaviorSubject<User>(null);
  commentText = '';
  commentVotes: Vote[];
  pointsTotal = 0;
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

  @Output()
  commented = new EventEmitter<any>();

  constructor(
    private qaService: QaService,
    private modalService: NgbModal,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit() {
    this.fetchVotes();
  }

  fetchVotes() {
    this.qaService.getVotesWithId(this.comment._id).subscribe(votes => {
      this.commentVotes = votes;
      this.commentVotes.forEach(v => {
        this.pointsTotal += v.vote;
        if (v.userId === this.user._id) {
          this.userVote = v.vote;
        }
      });
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
            comment: this.commentText
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

  vote(c, replace) {
    let vote: Vote = {
      userId: this.user._id,
      username: this.user.username,
      postId: this.comment._id,
      vote: 0
    };
    if (!replace) {
      if (c === '+') {
        vote.vote = 1;
        this.qaService.votePost(vote).subscribe(res => {
          this.fetchVotes();
        });
      }

      if (c === '-') {
        vote.vote = -1;
        this.qaService.votePost(vote).subscribe(res => {
          this.fetchVotes();
        });
      }
    } else {
      this.pointsTotal = 0;
      if (c === '+') {
        vote.vote = 1;
        this.qaService.replacePreviousVote(vote).subscribe(res => {
          this.fetchVotes();
        });
      }

      if (c === '-') {
        this.pointsTotal = 0;
        vote.vote = -1;
        this.qaService.replacePreviousVote(vote).subscribe(res => {
          this.fetchVotes();
        });
      }
    }
  }
}
