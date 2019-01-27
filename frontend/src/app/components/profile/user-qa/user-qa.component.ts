import { Component, OnInit } from '@angular/core';
import { QaService } from '../../../services/qa.service';
import { VoteService } from '../../../services/vote.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/User';
import { Answer } from '../../../models/Answer';
import { Question } from '../../../models/Question';
import { Vote } from '../../../models/Vote';
import { Comment } from '../../../models/Comment';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-qa',
  templateUrl: './user-qa.component.html',
  styleUrls: ['./user-qa.component.css']
})
export class UserQaComponent implements OnInit {
  user: User;
  answers: Answer[];
  votes: Vote[];
  comments: Comment[];

  constructor(
    private auth: AuthService,
    private qaService: QaService,
    private voteService: VoteService,
    private flashMessage: FlashMessagesService,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user = user;
      if (user.username) {
        this.qaService.getAllUserAnswersWithUsername(this.user.username).subscribe(
          answers => {
            this.answers = answers;
          },
          (error: Error) => {
            this.flashMessage.show(this.translator.instant('NETWORK_LOADING_ERROR'), {
              cssClass: 'alert-danger',
              timeout: 2000
            });
          }
        );
        this.voteService.getAllUserVotesWithId(this.user._id).subscribe(
          votes => {
            this.votes = votes;
          },
          (error: Error) => {
            this.flashMessage.show(this.translator.instant('NETWORK_LOADING_ERROR'), {
              cssClass: 'alert-danger',
              timeout: 2000
            });
          }
        );
        this.qaService.getAllUserCommentsWithId(this.user._id).subscribe(
          comments => {
            this.comments = comments;
          },
          (error: Error) => {
            this.flashMessage.show(this.translator.instant('NETWORK_LOADING_ERROR'), {
              cssClass: 'alert-danger',
              timeout: 2000
            });
          }
        );
      }
    });
  }
}
