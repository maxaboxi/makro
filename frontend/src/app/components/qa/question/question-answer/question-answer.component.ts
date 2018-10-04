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
  commentText = '';
  showOnlyFirstComment = true;
  answerVotes: Vote[];
  pointsTotal = 0;
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
  constructor(
    private qaService: QaService,
    private modalService: NgbModal,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit() {
    if (this.answer) {
      this.qaService
        .getCommentsToAnswerWithId(this.answer._id)
        .subscribe(comments => (this.answer.comments = comments));
      this.fetchVotes();
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
            replyTo: this.answer._id
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

  vote(c, replace) {
    let vote: Vote = {
      userId: this.user._id,
      username: this.user.username,
      postId: this.answer._id,
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

  fetchComments(e) {
    this.qaService
      .getCommentsToAnswerWithId(this.answer._id)
      .subscribe(comments => {
        this.answer.comments = comments;
      });
  }

  fetchVotes() {
    this.qaService.getVotesWithId(this.answer._id).subscribe(votes => {
      this.answerVotes = votes;
      this.answerVotes.forEach(v => {
        this.pointsTotal += v.vote;
        if (v.userId === this.user._id) {
          this.userVote = v.vote;
        }
      });
    });
  }
}
