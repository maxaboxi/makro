import { Component, OnInit, Input } from '@angular/core';
import { Answer } from '../../../../models/Answer';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../../../models/User';
import { QaService } from '../../../../services/qa.service';
import { VoteService } from '../../../../services/vote.service';
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
  pointsTotal = 0;
  userVote;
  votesFetched = false;

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
    private voteService: VoteService,
    private modalService: NgbModal,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit() {
    if (this.answer) {
      this.qaService.getCommentsToAnswerWithId(this.answer._id).subscribe(comments => (this.answer.comments = comments));
      this.voteService.getAllVotesWithPostId(this.answer._id).subscribe(votes => {
        votes.forEach(v => {
          this.pointsTotal += v.vote;
          if (v.userId === this.user._id) {
            v.vote > 0 ? (this.userVote = 'up') : (this.userVote = 'down');
          }
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
            postId: this.answer._id,
            username: this.user.username,
            userId: this.user._id,
            comment: this.commentText,
            replyTo: this.answer._id,
            origPost: this.answer.answer,
            questionId: this.answer.questionId
          };
          this.qaService.postNewComment(comment).subscribe(
            res => {
              if (res['success']) {
                this.qaService.getCommentsToAnswerWithId(this.answer._id).subscribe(comments => (this.answer.comments = comments));
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
      content: this.answer.answer,
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

  fetchComments(e) {
    this.qaService.getCommentsToAnswerWithId(this.answer._id).subscribe(comments => {
      this.answer.comments = comments;
    });
  }
}
