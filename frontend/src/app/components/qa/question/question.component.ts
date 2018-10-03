import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../../models/User';
import { Question } from '../../../models/Question';
import { QaService } from '../../../services/qa.service';
import { Answer } from '../../../models/Answer';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Comment } from '../../../models/Comment';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  private _user = new BehaviorSubject<User>(null);
  private _question = new BehaviorSubject<Question>(null);
  answers: Answer[];
  answer: Answer;
  answerText = '';
  commentText = '';
  voted = false;

  @Input()
  set user(user) {
    this._user.next(user);
  }

  get user() {
    return this._user.getValue();
  }

  @Input()
  set question(q) {
    this._question.next(q);
  }

  get question() {
    return this._question.getValue();
  }

  constructor(
    private qaService: QaService,
    private modalService: NgbModal,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit() {
    this.qaService
      .getTopResponseToQuestion(this.question._id)
      .subscribe(answer => {
        this.answer = answer[0];
      });
  }

  openAnswerModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          const answer: Answer = {
            username: this.user.username,
            answer: this.answerText,
            questionId: this.question._id
          };
          this.qaService.addAnswerToQuestion(answer).subscribe(
            res => {
              if (res['success']) {
                this.qaService
                  .getTopResponseToQuestion(this.question._id)
                  .subscribe(answer => (this.answer = answer));
                this.flashMessage.show('Vastaus lisätty', {
                  cssClass: 'alert-success',
                  timeout: 2000
                });

                this.answerText = '';
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
          this.answerText = '';
        }
      },
      dismissed => {
        this.answerText = '';
      }
    );
  }

  openCommentModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          const comment: Comment = {
            postId: this.answer._id,
            username: this.user.username,
            comment: this.commentText
          };
          this.qaService.postNewComment(comment).subscribe(
            res => {
              if (res['success']) {
                this.qaService
                  .getTopResponseToQuestion(this.question._id)
                  .subscribe(answer => (this.answer = answer[0]));
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
    let vote = {
      userId: this.user._id,
      postId: this.answer._id,
      vote: 0
    };
    if (c === '+') {
      vote.vote = 1;
      this.qaService.votePost(vote).subscribe(res => {
        console.log(res);
      });
    }

    if (c === '-') {
      vote.vote = -1;
      this.qaService.votePost(vote).subscribe(res => {
        console.log(res);
      });
    }
  }
}
